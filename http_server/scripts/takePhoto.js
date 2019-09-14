
(function() {


    function checkCompatibility(elem) {
        if (navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => isCompatibleThen(elem, stream))
            .catch((err) => isNotCompatibleThen(elem, err));
        }
    }

    function isCompatibleThen(elem, stream) {
        elem.srcObject = stream;
    }
    function isNotCompatibleThen(elem, err) {
        console.error("Something went wrong!");
    }


    $(document).ready(function() {
        checkCompatibility($("#photo-live-display")[0])
    });

})()
