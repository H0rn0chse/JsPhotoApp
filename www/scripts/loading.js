var Loading = (function (loading) {

    var $el;

    const LOADING_TEXT = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est";

    loading.init = function ($parent) {
        $el = $parent

        var words = LOADING_TEXT.split(" ");

        var html = "";
        for (var w = 0; w < words.length; w++) {
            html += '<span class="w w-' + w + '">' + words[w] + '</span>';
        }

        $el.html(html);
    };

    loading.update = function (progress) { // progress in integer percent
        if ($el === undefined) {
            console.error("Loading parent not defined, call init($parent)");
            return;
        }
        $el.removeClass(); // removes all classes
        $el.addClass("p-" + progress);
    };

    return loading;
  }(Loading || {}));
