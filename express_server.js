var express = require("express");
var app = express();
var PORT = 8080 //default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");


const urlDatabase = {
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

app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {shortURL: req.params.shortURL,
  longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

//generate short url
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL
  res.redirect("/urls/" + shortURL);  
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

//delete link 
app.post ("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];  
  res.redirect("/urls/");
});
//update link
app.post ("/urls/:shortURL/update", (req, res) => {
console.log ("params", req.params);
console.log ("body", req.body);
  urlDatabase[req.params.shortURL] = req.body.longURL
  //console.log("test")
  res.redirect("/urls/");
});

function generateRandomString(){
  let output = '';
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrtuvwxyz1234567890";
  for(let i = 0; i < 5; i++) {
     let random = Math.floor((Math.random() * 25) + 97);
    output += String.fromCharCode(random)
  }
  return output
}

Object.assign(urlDatabase);