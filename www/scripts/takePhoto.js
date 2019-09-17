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

        ProgressBar.reset();

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
        ProgressBar.update(prog);
        console.log(prog);

    }

    function onProcessDone(obj) {
        console.log(obj);

        // PopupControl($(".popup-area"))
        //     .setTitleAndText("", obj.text)
        //     .open()
        //     .onClose(function() {
        //         $("body").removeClass("has-taken-photo")
        //     });

        ProgressBar.reset();

        var $results = $(".photo-display .result-display");
        var $videoStream = $("#video-live-display");

        var v_w = $videoStream[0].videoWidth;
        var v_h = $videoStream[0].videoHeight;
        var s_w = $videoStream.width();
        var s_h = $videoStream.height();


        var v_to_s_factor;
        if (v_w/v_h > s_w/s_h) { // stripes above and below
            var n_h = s_w / (v_w / v_h);
            var n_t = (s_h - n_h) / 2.0;
            v_to_s_factor = s_w / v_w;

            $results.css("top", n_t + "px");
            $results.css("width", "100%");
            $results.css("height", n_h + "px");
        } else { // stripes left and right
            var n_w = s_h / (v_h / v_w);
            var n_l = (s_w - n_w) / 2.0;
            v_to_s_factor = s_h / v_h;

            $results.css("left", n_l + "px");
            $results.css("height", "100%");
            $results.css("width", n_w + "px");
        }

        // Add bounding box for each word
        var html = "";
        for (var w = 0; w < obj.words.length; w++) {
            var word = obj.words[w];
            var text = word.text;

            var b = word.bbox;
            var b_l = 100.0 * b.x0 / v_w;
            var b_t = 100.0 * b.y0 / v_h;
            var b_w = 100.0 * (b.x1-b.x0) / v_w;
            var b_h = 100.0 * (b.y1-b.y0) / v_h;

            if (b_h >= 100 && b_w >= 100) {
                continue;
            }

            var opacity = 0.4 + (0.6 * word.confidence / 100.0);
            html += '<div class="bbox" style="left: '+ b_l +'%; top: '+ b_t +'%; width: '+ b_w +'%; height: '+ b_h +'%; opacity: '+ opacity +'; font-size: ' + (word.font_size*v_to_s_factor*0.85) + 'px; ' + ((word.is_bold) ? "font-weight: bold;" : "") + '"><span>'+ text +'</span></div>';
        }

        $results.html(html);

        $("body").addClass("done-processing");
    }

    function preprocessPhoto(imageData) {
        imageData = CanvasHelper.grayscaleImage(imageData);
        imageData = CanvasHelper.contrastImage(imageData, 40);
        imageData = CanvasHelper.lightenImage(imageData, 65);

        return imageData;
    }

    function onTakePhotoButtonClick() {
        if ($("body").hasClass("has-taken-photo")) {
            TesseractWorker.stop();
            ProgressBar.reset();
            $(".photo-display .result-display").html("");
            $("body").removeClass("done-processing");
        } else {
            takePhoto($("#video-live-display")[0], $("#photo-take-cache")[0])
        }

        $("body").toggleClass("has-taken-photo");
    }

    $(document).ready(function() {

        checkCompatibility($("#video-live-display")[0]);
        ProgressBar.init($(".loading-area > div"));
        $("#photo-take").click(function(){onTakePhotoButtonClick()});

        if (Math.random() < 0.005) {
            ProgressBar = Loading;
        }
    });

})()
