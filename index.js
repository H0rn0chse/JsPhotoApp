var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {

  res.writeHead(200, {'Content-Type': 'text/html'});
  var path = "http_server/" + req.url;

  var exists = fs.existsSync(path);

  if (exists) {
      var isDir = fs.lstatSync(path).isDirectory();
      var isFile = fs.lstatSync(path).isDirectory();
      if (isDir) {
          path = path + "/" + "index.html";
      }

      var index = fs.readFileSync(path);
  }

  res.end(index);
}).listen(3000);
