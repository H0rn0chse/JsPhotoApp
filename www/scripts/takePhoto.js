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

        Loading.reset();

        $(".photo-display").css("background-image", "url("+photo+")");
    }

    function onProcessProgress(obj) {

        var stati = [
            ["loading tesseract core", 0.08],
            ["initializing tesseract", 0.07],
            ["initialized tesseract", 0.05],
            ["loading language traineddata", 0.06],
            ["loaded language traineddata", 0.06],
            ["initializing api", 0.07],
            ["recognizing text", 0.61]
        ];

        prog = 0;
        var s = 0;
        for (s = 0; s < stati.length; s++) {

            if (stati[s][0] === obj.status) {
                break;
            }
            prog += stati[s][1];
        }

        prog = Math.round((prog + stati[s][1] * obj.progress) * 100);
        Loading.update(prog);
        console.log(prog);

    }

    function onProcessDone(obj) {
        console.log(obj);
        PopupControl($(".popup-area"))
            .setTitleAndText("", obj.text)
            .open()
            .onClose(function() {
                $("body").removeClass("has-taken-photo")
            });
        $("body").addClass("done-processing");
    }

    function preprocessPhoto(imageData) {
        imageData = CanvasHelper.grayscaleImage(imageData);
        imageData = CanvasHelper.contrastImage(imageData, 50);
        imageData = CanvasHelper.lightenImage(imageData, 80);
        return imageData;
    }

    function onTakePhotoButtonClick() {
        if ($("body").hasClass("has-taken-photo")) {
            TesseractWorker.stop();
            $("body").removeClass("done-processing");
        } else {
            takePhoto($("#video-live-display")[0], $("#photo-take-cache")[0])
        }

        $("body").toggleClass("has-taken-photo");
    }

    $(document).ready(function() {
        checkCompatibility($("#video-live-display")[0]);
        Loading.init($(".loading-area > div"));
        $("#photo-take").click(function(){onTakePhotoButtonClick()});
    });

})()
