var CanvasHelper = (function (canvasHelper) {

    canvasHelper.contrastImage = function (imageData, contrast) {  // contrast as an integer percent
        var data = imageData.data;  // original array modified, but canvas not updated
        contrast *= 2.55; // or *= 255 / 100; scale integer percent to full range
        var factor = (255 + contrast) / (255.01 - contrast);  //add .1 to avoid /0 error

        for(var i=0;i<data.length;i+=4)  //pixel values in 4-byte blocks (r,g,b,a)
        {
            data[i] = factor * (data[i] - 128) + 128;     //r value
            data[i+1] = factor * (data[i+1] - 128) + 128; //g value
            data[i+2] = factor * (data[i+2] - 128) + 128; //b value

        }
        return imageData;  //optional (e.g. for filter function chaining)
    }

    canvasHelper.lightenImage = function (imageData, brightness) {  // brightness as an integer percent
        var data = imageData.data;  // original array modified, but canvas not updated

        for(var i=0; i<data.length; i++) {
            if (i % 4 != 3) {
                data[i] = Math.min(255, data[i]*(1+brightness/100));

            }
        }
        return imageData;  //optional (e.g. for filter function chaining)
    }

    canvasHelper.grayscaleImage = function(imageData){
        var data = imageData.data;

        for(var i = 0; i < data.length; i += 4) {
          var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
          // red
          data[i] = brightness;
          // green
          data[i + 1] = brightness;
          // blue
          data[i + 2] = brightness;
        }
        return imageData;
    }
  
    return canvasHelper;
  }(CanvasHelper || {}));