var PopupControl = (function (popupControl) {

    // https://stackoverflow.com/questions/7467840/nl2br-equivalent-in-javascript
    function nl2br (str, is_xhtml) {
        if (typeof str === 'undefined' || str === null) {
            return '';
        }
        var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    }

    return function($popupArea) {
        popupControl.setTitleAndText = function (title, text) {
            $popupArea.find("b").text(title);
            $popupArea.find("p").html(nl2br(text));
            return popupControl;
        }
        popupControl.open = function () {
            $popupArea.addClass("popup-area--open");
            $popupArea.find(".popup-area-bg").one("click", function() {
                popupControl.close();
            })
            return popupControl;
        }
        popupControl.close = function () {
            $popupArea.removeClass("popup-area--open");
            return popupControl;
        }

        return popupControl;

    }
  }(PopupControl || {}));
