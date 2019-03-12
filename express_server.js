var express = require("express");
var app = express();
var PORT = 8080 //default port 8080

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xvn2": "http://www.lighthouselabs.ca",
  "9sd5xk": "http://www.google.com"
};

app.get("/" , (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example App listening on ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) =>{
  res.send("<html><body>Hello <b>World</b></body></html>\n")
})