var ProgressBar = (function (progressBar) {

    var $el;
    var lastProgress = -1;



    progressBar.init = function ($parent) {
        $parent.html('<div class="progress__container"><div class="progress__bar pb"></div></div>');
        $el = $parent;
    };

    progressBar.reset = function() {
        $el.removeClass(); // remove all classes
        lastProgress = -1;
    }

    progressBar.update = function (progress) { // progress in integer percent
        if ($el === undefined) {
            console.error("ProgressBar parent not defined, call init($parent)");
            return;
        }
        // add new class
        $el.addClass("p-" + progress);
        // remove all previous classes
        for (var p = lastProgress; p < progress; p++) {
            $el.removeClass("p-" + p);
        }


    };

    return progressBar;
}(ProgressBar || {}));
