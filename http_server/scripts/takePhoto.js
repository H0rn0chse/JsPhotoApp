
(function() {



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
            var constraints = { audio: false, video: { width: 1280, height: 720 } };
            navigator.mediaDevices.getUserMedia(constraints)
                .then(function(stream) { isCompatibleThen(elem, stream) })
                .catch(function(err) { isNotCompatibleThen(elem, err) });
        }
    }

    function isCompatibleThen(elem, stream) {
        alert("compatible");


        // Older browsers may not have srcObject
        if ("srcObject" in elem) {
            elem.srcObject = stream;
        } else {
            // Avoid using this in new browsers, as it is going away.
            elem.src = URL.createObjectURL(stream);
        }
        elem.onloadedmetadata = function(e) { elem.play(); };
    }
    function isNotCompatibleThen(elem, err) {
        $("body").addClass("not-compatible");
        alert("Not compatible: " + err);
    }


    $(document).ready(function() {
        checkCompatibility($("#photo-live-display")[0]);


    });

})()
