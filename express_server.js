var express = require("express");
var app = express();
var PORT = 8080 //default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var cookieParser = require('cookie-parser')
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xvn2": "http://www.lighthouselabs.ca",
  "9sd5xk": "http://www.google.com"

};

app.use(cookieParser());

//home page
app.get("/" , (req, res) => {
  let templateVars = {urls: urlDatabase,
  username:req.cookies["username"]};
  if(templateVars.username){
    res.redirect('/urls');
  } else {
    res.redirect('/urls');
  }
});

app.listen(PORT, () => {
  console.log(`Example App listening on ${PORT}!`);  
});

//main url page
app.get("/urls", (req, res) => {
  let templateVars = {urls: urlDatabase,
    username:req.cookies["username"]    };
  res.render("urls_index", templateVars);
});

//new 
app.get("/urls/new", (req, res) => {
  let templateVars = {
    username:req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

//shortURL page
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {shortURL: req.params.shortURL,
  longURL: urlDatabase[req.params.shortURL], 
    username:req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

//generate short url
app.post("/urls", (req, res) => {
  let templateVars = {
    username:req.cookies["username"]  };
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL
  res.redirect("/urls/" + shortURL);  
});

app.get("/u/:shortURL", (req, res) => {
  let templateVars = {
    username:req.cookies["username"],
  };
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

//delete link 
app.post ("/urls/:shortURL/delete", (req, res) => {
  let templateVars = {
    username:req.cookies["username"],
  };
  delete urlDatabase[req.params.shortURL];  
  res.redirect("/urls/");
});
//update link
app.post ("/urls/:shortURL/update", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL
  res.redirect("/urls/");
    let templateVars = {
    username:req.cookies["username"]
    };
});

// header login form
app.post("/login", (req, res) => {
  //const username = ("username", req.body);
 // console.log(req.body.username )
  res.cookie("username", req.body.username);
  username:req.cookies["username"]
  res.redirect("/urls");
});

// header logout form
app.post("/logout", (req, res) => {
  res.clearCookie("username", req.body.username);
  username:req.cookies["username"]
  res.redirect("/urls");
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