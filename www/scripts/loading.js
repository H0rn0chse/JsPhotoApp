var Loading = (function (loading) {

    var $el;
    var lastProgress = -1;

    const LOADING_TEXT = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.";

    loading.init = function ($parent) {
        $el = $parent;

        var words = LOADING_TEXT.split(" ");

        var html = "";
        for (var w = 0; w < words.length; w++) {
            html += '<span class="w">' + words[w] + '</span>';
        }

        $el.html(html);
    };

    loading.reset = function() {
        $el.removeClass(); // remove all classes
        lastProgress = -1;
    }

    loading.update = function (progress) { // progress in integer percent
        if ($el === undefined) {
            console.error("Loading parent not defined, call init($parent)");
            return;
        }
        for (var p = lastProgress + 1; p <= progress; p++) {
            $el.addClass("p-" + p);
        }

    };

    return loading;
  }(Loading || {}));
