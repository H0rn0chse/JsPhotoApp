# JsPhotoApp

A small web app to test mobile camera control using `navigator.mediaDevices.getUserMedia` and text recognition using [Tesseract.js](https://tesseract.projectnaptha.com/).

# Getting started


## Start Node server
A Node.js server is used as a web server and as a development environment. Call the following to start the the server locally:

``npm start``

The app can either be opened locally ([localhost:3000](localhost:3000)) or by other devices through a shared local network (something like [192.168.0.100:3000](192.168.0.100:3000)).

**Note:** Mobile phones may not allow camera usage on a non SSL-secure connection.

## Start PhoneGap
PhoneGap is a service that emulates the web app as a native app.
It requires a desktop application that starts (another) local server and a mobile app, which embeds the web app.
Install both to use.
More information [can be found on their website](https://phonegap.com/).

# Used services and libraries
* [Node.js](https://nodejs.org/en/) for serving and as a development environment
* [SASS](https://sass-lang.com/) for CSS precompilation
* [jQuery](https://jquery.com) for more robust javascript
* [Tesseract.js](https://tesseract.projectnaptha.com/) for text recognition
* [Bootstrap Glyphicons](https://getbootstrap.com/docs/3.3/components/) for icons
* [PhoneGap](https://phonegap.com/) for emulating the web app as a native app

# Text recognition
A taken photo is preprocessed rudimentally by increasing contrast and brightness.
Tesseract.js then recognizes text using a pre-trained long short-term memory (yeah, that's a neural network).
The resulting text, its bounding boxes and confidence are displayed on the screen.


| ![](https://raw.githubusercontent.com/H0rn0chse/JsPhotoApp/master/screenshots/case-1-before.png) | ![](https://raw.githubusercontent.com/H0rn0chse/JsPhotoApp/master/screenshots/case-1-after.png) |
![](https://raw.githubusercontent.com/H0rn0chse/JsPhotoApp/master/screenshots/case-2-before.png) | ![](https://raw.githubusercontent.com/H0rn0chse/JsPhotoApp/master/screenshots/case-2-after.png) |

The recognition is not perfect but deals very well with well readable, printed text.
Also, better image preprocessing could drastically increase the quality.
