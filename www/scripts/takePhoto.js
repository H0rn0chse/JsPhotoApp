(function() {



    function checkCompatibility(elem) {

        if (navigator.mediaDevices.getUserMedia) {
            var constraints = { audio: false, video: {facingMode: 'environment'}};
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
            canvas.width = elem.videoWidth;
            canvas.height = elem.videoHeight;
            elem.play();
        };
    }
    function isNotCompatibleThen(elem, err) {
        $("body").addClass("is-not-compatible");
    }

    function takePhoto(img, canvas) {
        var context = canvas.getContext('2d');
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        var imageData = context.getImageData(0,0,canvas.width, canvas.height);

        imageData = preprocessPhoto(imageData);

        // overwrite original image
        context.putImageData(imageData, 0, 0);

        var photo = canvas.toDataURL("image/png");
        window.photo = photo;
        TesseractWorker.loadImage(photo, function(obj){onProcessProgress(obj)}, function(obj){onProcessDone(obj)});

        $(".photo-display").css("background-image", "url("+photo+")");
    }

    function onProcessProgress(obj) {
        if (obj.status === "recognizing text") {
            var prog = Math.round(obj.progress * 100);
            console.log(prog);
        }
    }

    function onProcessDone(obj) {
        console.log(obj);
        PopupControl($(".popup-area"))
            .setTitleAndText("", obj.text)
            .open()
            .onClose(function() {
                $("body").removeClass("has-taken-photo")
            });
    }

    function preprocessPhoto(imageData) {
        imageData = CanvasHelper.grayscaleImage(imageData);
        imageData = CanvasHelper.contrastImage(imageData, 50);
        imageData = CanvasHelper.lightenImage(imageData, 50);
        return imageData;
    }

    function onTakePhotoButtonClick() {
        if ($("body").hasClass("has-taken-photo")) {
            TesseractWorker.stop();
        } else {
            takePhoto($("#video-live-display")[0], $("#photo-take-cache")[0])
        }

        $("body").toggleClass("has-taken-photo");
    }

    $(document).ready(function() {
        checkCompatibility($("#video-live-display")[0]);
        $("#photo-take").click(function(){onTakePhotoButtonClick()});
    });

})()
