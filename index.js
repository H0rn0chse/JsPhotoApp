var http = require('http');
var fs = require('fs');
var mime = require('mime-types');

http.createServer(function (req, res) {
    var path = "www" + req.url;
    var fallbackPath = "www/fileNotFound.html";

    var fileExists = fs.existsSync(path);

    if (fileExists) {
        //redirect to index.html
        var isDir = fs.lstatSync(path).isDirectory();
        if (isDir) {
            path = path + "/index.html";
            fileExists = fs.existsSync(path);
        }
    }
    path = fileExists ? path : fallbackPath;

    var index = fs.readFileSync(path);

    var contentType = mime.lookup(path);
    if (contentType === false) {
        contentType = "text/plain";
    }

    res.writeHead(200, {'Content-Type': contentType});

    res.end(index);
}).listen(3000);
