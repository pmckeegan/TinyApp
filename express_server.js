var express = require("express");
var app = express();
var PORT = 8080 //default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
var cookieParser = require('cookie-parser')
app.use(cookieParser());

const bcrypt = require('bcrypt');
const password = "purple-monkey-dinosaur"; // found in the req.params object
const hashedPassword = bcrypt.hashSync(password, 10);

const urlDatabase = {
  "b2xvn2": {
    longURL: "http://www.lighthouselabs.ca", 
    userID: "userRandomID" 
  },
  "9sd5xk": {
    longURL: "http://www.google.com", 
    userID: "user2RandomID" 
  }
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

  function urlsForUser(id) {
    const longURL = urlDatabase.longURL;
    for (var userID in longURL) {
      if(longURL.userID === req.cookies.user_id);
    }
    return false;
  }

//Register URL
app.get("/register", (req, res) => {
  res.render("register");
});

// Registration Form.This is ugly right now
app.post("/register", (req, res) => {
  var userID = generateRandomString();
  let encryptedPW = bcrypt.hashSync(req.body.password, 10)
  let userInfo = {
    id: userID,
    email: req.body.email,
    password: encryptedPW
  };
  console.log(userInfo)
  //check inputs for content and email for duplicates
  if(!userInfo.email || !userInfo.password) {
    res.status(400).send('Enter your email address and choose a password to register.');
    
  } else if (emailVerifier(req.body.email)) {
    res.status(400).send('That email address is already registered!');
  } else {
    users[userID] = userInfo;
    res.cookie('user_id', userID);
    res.redirect('/urls');
  }
});

//home page
app.get("/" , (req, res) => {
    res.redirect('/urls');
  
});

app.get("/login", (req, res) => {
  urlsForUser();
  res.render('login');
});

//main url page
app.get("/urls", (req, res) => {
if (!req.cookies.user_id) {
  res.send("Please login or register to continue")
} else {
  let templateVars = {urls: urlDatabase, 
      username:req.cookies.user_id
    };
    res.render("urls_index", templateVars);
}

});
//new 

app.get("/urls/new", (req, res) => {
  if (req.cookies.user_id) {
    let templateVars = {
      username:res.cookie.user_id
    };
    res.render("urls_new", templateVars)
  } else {
    res.redirect("/login")  
  }
});


//shortURL page
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {shortURL: req.params.shortURL,
  longURL: urlDatabase[req.params.shortURL], 
    username:req.cookies.user_id
  };
  res.render("urls_show", templateVars);
});

//generate short url
app.post("/urls", (req, res) => {
  let templateVars = {
    username:req.cookies.user_id  };
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL
  res.redirect("/urls/" + shortURL);  
});

app.get("/u/:shortURL", (req, res) => {
  let templateVars = {
    username:req.cookies.user_id,
  };
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

//delete link 
app.post ("/urls/:shortURL/delete", (req, res) => {
if (urlDatabase[shortURL].userID === req.cookies.user_id)
delete urlDatabase[req.params.shortURL];  
  
  res.redirect("/urls");
});
//update link
app.post ("/urls/:shortURL/update", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL
  res.redirect("/urls/");
    let templateVars = {
    username:req.cookies.user_id
    };
});

// header login form
app.post("/login", (req, res) => {
  let login = false;
  let userID = '';
  console.log(users[user].id)

//check login credentials
  for (var user in users) {
    if ((users[user].email === req.body.email) && (bcrypt.compareSync(req.body.password, users[user].password))) {
      login = true;
      userID = users[user].id;
    }
  }
  if (!emailVerifier(req.body.email)) {
    res.status(403)
    res.send('that email does not exist');
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