
(function() {

    window.appState = window.appState | {};
    window.appState.hasTakenPhoto = window.hasTakenPhoto | false;

    function checkCompatibility(elem) {

        // Older browsers might not implement mediaDevices at all, so we set an empty object first
        if (navigator.mediaDevices === undefined) {
          navigator.mediaDevices = {};
        }

        // Some browsers partially implement mediaDevices. We can't just assign an object
        // with getUserMedia as it would overwrite existing properties.
        // Here, we will just add the getUserMedia property if it's missing.
        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function(constraints) {

                // First get ahold of the legacy getUserMedia, if present
                var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

                // Some browsers just don't implement it - return a rejected promise with an error
                // to keep a consistent interface
                if (!getUserMedia) {
                  return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                }

                // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
                return new Promise(function(resolve, reject) {
                  getUserMedia.call(navigator, constraints, resolve, reject);
                });
          }
        }

        if (navigator.mediaDevices.getUserMedia) {
            var constraints = { audio: false, video: true };
            navigator.mediaDevices.getUserMedia(constraints)
                .then(function(stream) { isCompatibleThen(elem, stream) })
                .catch(function(err) { isNotCompatibleThen(elem, err) });
        }
    }

    function isCompatibleThen(elem, stream) {
        $("body").addClass("is-compatible");
        if ("srcObject" in elem) elem.srcObject = stream;
        else elem.src = URL.createObjectURL(stream);
        elem.onloadedmetadata = function(e) {
            var canvas = document.getElementById("photo-take-cache");

            ratio = elem.videoWidth/elem.videoHeight;
            w = elem.videoWidth-100;
            h = parseInt(w/ratio,10);
            canvas.width = w;
            canvas.height = h;
            elem.play();
        };
    }
    function isNotCompatibleThen(elem, err) {
        $("body").addClass("is-not-compatible");
    }

    function takePhoto(img, canvas) {
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);

        var photo = canvas.toDataURL("image/png");
        window.photo = photo;
        console.log(photo);
        $(".photo-display").css("background-image", "url("+photo+")");

        $("body").addClass("has-taken-photo");
    }

    $(document).ready(function() {
        checkCompatibility($("#video-live-display")[0]);
        $("#photo-take").click(function(){
            takePhoto($("#video-live-display")[0], $("#photo-take-cache")[0])
        });
    });

})()
