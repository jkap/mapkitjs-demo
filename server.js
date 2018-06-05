// server.js
// where your node app starts

// init project
var express = require("express");
var app = express();
const jwt = require("jsonwebtoken");

const cert = new Buffer(process.env.BASE64_KEY, "base64").toString("utf8");

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/token", function(request, response) {
  const payload = {
    iss: process.env.ISSUER,
    origin: "https://jkap-mapkitjs-demo.glitch.me"
  };
  
  const token = jwt.sign(payload, cert, {
    expiresIn: "1h",
    algorithm: "ES256",
    keyid: process.env.KEY_ID
  });
  response.send(token);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
