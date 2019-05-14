var express = require("express");
var app = express();
const bodyParser = require("body-parser");
var cookieSession = require('cookie-session')
const bcrypt = require('bcrypt');
const password = "purple-monkey-dinosaur"; // found in the req.params object
const hashedPassword = bcrypt.hashSync(password, 10);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
var PORT = 8080 //default port 8080

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

// app.use(function(req, res, next) {
//   res.locals.user_id = req.session["user_id"] || false;
//   next();
// });

//--Application Functions

//generate random string for url and for userID
function generateRandomString(){
  let output = '';
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrtuvwxyz1234567890";
  for(let i = 0; i < 5; i++) {
     let random = Math.floor((Math.random() * 25) + 97);
    output += String.fromCharCode(random)
  }
  return output
};

//check for email in the database
function emailVerifier(email) {
  for (var userID in users) {
    if (users[userID].email === email) return true;
  };
  return false;
};

function urlsForUser(id) {
  const longURL = urlDatabase.longURL;
  for (var userID in longURL) {
    if(longURL.userID === req.session.user_id);
  }
  return false;
}

function registerUser(email, password) {
  const id = generateRandomString();
  const newUser = {
    id,
    email,
    password
  };
  users[id] = newUser;
  return newUser;
}


//--Database Info
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

const users = { 
  "userRandomID": {
    id: "", 
    email: "", 
    password: ""
  }
};

//Register URL
app.get("/register", (req, res) => {
  res.render('register')
});

// Registration Form.
app.post("/register", (req, res) => {

  var userID = generateRandomString();
  let encryptedPW = bcrypt.hashSync(req.body.password, 10)
  let email = req.body.email
  let userInfo = {
    id: userID,
    email: email,
    password: encryptedPW
  };
  //check inputs for content and email for duplicates
  if(!userInfo.email || !userInfo.password) {
    res.status(400).send('Enter your email address and choose a password to register.');
    
  } else if (emailVerifier(req.body.email)) {
    res.status(400).send('That email address is already registered!');
  } else {

    const newUser = registerUser(email, password);
    req.session.user_id = newUser.id;
    res.redirect("/urls/");
    
    res.session('user_id', userID);
    res.redirect('/urls');
  }
});

//home page
app.get("/" , (req, res) => {
  if (req.session.user_id) {
    res.redirect('/urls');
  }
    res.redirect('/register');
  
});

app.get("/login", (req, res) => {
  urlsForUser();
  res.render('login');
});

//main url page
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase, 
    shortURL: req.params.shortURL,
    username:req.session.user_id
  };
  console.log("REQ BODEE", req.body)
  res.render("urls_index", templateVars);
});

//generate short url
app.post("/urls", (req, res) => {
  let templateVars = {
    username:req.session.user_id,
    urls: urlDatabase,
  };
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL
  res.redirect("/urls/" + shortURL);  
  res.render(templateVars)
});

//new 

app.get("/urls/new", (req, res) => {
  if (req.session.user_id) {
    let templateVars = {
      username:res.session.user_id
    };
    res.render("urls_new", templateVars)
  } else {
    res.redirect("/login")  
  }
});


//redirect
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});



app.get("/urls/:shortURL", (req, res) => {
  if (req.session.user_id) {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user_id: req.session.user_id,
      email: users[req.session.user_id]
    };
    res.render("urls_show", templateVars);
  } else {
    res.status(403).send("can't edit someone else's urls");
  }
});

//delete link 
app.post ("/urls/:shortURL/delete", (req, res) => {
if (urlDatabase[shortURL].userID === req.session.user_id)
delete urlDatabase[req.params.shortURL];  
  
  res.redirect("/urls")
  ;
});
//update link
app.post ("/urls/:shortURL/update", (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    let newURL = req.body.longURLrename;
    urlDatabase[req.params.shortURL].longURL= newURL;
    res.redirect("/urls/");
  } else {
    res.status(403).send("Can't edit someone else's URL's!")
  }
});

// header login form
app.post("/login", (req, res) => {
  let login = false;
  let userID = '';

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
    res.session('user_id', userID);
    res.redirect('/urls');
  }
})

// header logout form
app.post("/logout", (req, res) => {
  res.session = null;
  res.redirect("/login");
});


app.listen(PORT, () => {
});
Object.assign(urlDatabase);