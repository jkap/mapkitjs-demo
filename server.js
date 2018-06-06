const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

const tokenConfig = {
  cert: new Buffer(process.env.BASE64_KEY, "base64").toString("utf8"),
  iss: process.env.ISSUER,
  keyid: process.env.KEY_ID
};

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/token", function(request, response) {
  const { cert, iss, keyid } = tokenConfig;

  const payload = {
    iss,
    origin: "https://jkap-mapkitjs-demo.glitch.me"
  };

  const token = jwt.sign(payload, cert, {
    expiresIn: "10m",
    algorithm: "ES256",
    keyid
  });
  response.send(token);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
