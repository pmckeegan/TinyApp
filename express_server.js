var express = require("express");
var app = express();
var PORT = 8080 //default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
var cookieParser = require('cookie-parser')
app.use(cookieParser());

const urlDatabase = {
  "b2xvn2": "http://www.lighthouselabs.ca",
  "9sd5xk": "http://www.google.com"
};

app.use(function(req, res, next) {
  res.locals.user_id = req.cookies["user_id"] || false;
  next();
});

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};
function emailVerifier(email) {
  for (var userID in users) {
    if (users[userID].email === email) return true;
  };
  return false;
  };
//Register URL
app.get("/register", (req, res) => {
  res.render("register");
});

// Registration Form.This is ugly right now
app.post("/register", (req, res) => {
  var userID = generateRandomString();
  let userInfo = {
    id: userID,
    email: req.body.email,
    password: req.body.password
  };
  //check inputs for content and email for duplicates
  if(!userInfo.email || !userInfo.password) {
    res.status(400).send('Enter your email address and choose a password to register.');
    
  } else if (emailVerifier(req.body.email)) {
    res.status(400).send('That email address is already registered!');
  } else {
    users[userID] = userInfo;
    res.cookie('user_id', userID);
    res.redirect('/urls');
    console.log("User successfully registered", users, "_______________")
  }
});

//home page
app.get("/" , (req, res) => {
    res.redirect('/urls');
  
});

app.get("/login", (req, res) => {
  res.render('login');
});

//main url page
app.get("/urls", (req, res) => {
  let templateVars = {shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL], 
      username:req.cookies["user_id"]
    };
res.render("urls_index", templateVars);
});

//new 
app.get("/urls/new", (req, res) => {
  let templateVars = {
    username:res.cookie["user_id"]
  };
  res.render("urls_new", templateVars);
});

//shortURL page
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {shortURL: req.params.shortURL,
  longURL: urlDatabase[req.params.shortURL], 
    username:req.cookies["user_id"]
  };
  res.render("urls_show", templateVars);
});

//generate short url
app.post("/urls", (req, res) => {
  let templateVars = {
    username:req.cookie["user_id"]  };
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL
  res.redirect("/urls/" + shortURL);  
});

app.get("/u/:shortURL", (req, res) => {
  let templateVars = {
    username:req.cookies["user_id"],
  };
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

//delete link 
app.post ("/urls/:shortURL/delete", (req, res) => {
  let templateVars = {
    username:req.cookies["user_id"],
  };
  delete urlDatabase[req.params.shortURL];  
  res.redirect("/urls/");
});
//update link
app.post ("/urls/:shortURL/update", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL
  res.redirect("/urls/");
    let templateVars = {
    username:req.cookies["user_id"]
    };
});

// header login form
app.post("/login", (req, res) => {
  let login = false;
  let userID = '';
//check login credentials
  for (var user in users) {
    if ((users[user].email === req.body.email) && (users[user].password === req.body.password)) {
      login = true;
      userID = users[user].id;
    }
  }
  if (!emailVerifier(req.body.email)) {
    res.status(403)
    res.send('that email does not exist');
     console.log('email doesnt exist')
  } else if (login) {
    res.cookie('user_id', userID);
    res.redirect('/urls');
  }
})





// header logout form
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
});


//generate random string for url and for userID
function generateRandomString(){
  let output = '';
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrtuvwxyz1234567890";
  for(let i = 0; i < 5; i++) {
     let random = Math.floor((Math.random() * 25) + 97);
    output += String.fromCharCode(random)
  }
  return output
}

app.listen(PORT, () => {
});
Object.assign(urlDatabase);