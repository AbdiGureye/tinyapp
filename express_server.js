const express = require("express");
const app = express();
const PORT = 8080; 
const cookieParser = require("cookie-parser")
app.use(cookieParser());
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
function generateRandomString() {
return Math.random().toString(36).slice(5) 
}

const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
  }
};

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
}

const findUserinUsers = function(userInput, usersDB) {
  for(let user in usersDB) {
    if(userInput.email === users[user].email) {
      return true;
    }
    if(userInput.password === users[user].password) {
      return true;
    }
  }
  return null;
}

const findUserByEmail = function(usersObj, email) {
  for(let user in usersObj) {
    if(email === users[user].email) {
      
        return usersObj[user];
    }
  }
  return undefined;
}

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  const id = req.cookies["user_id"];
  const user = users[id]
  if(!user) {
    res.redirect("/login")
  }

  templateVars = {user}
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  const id = req.cookies["user_id"];
  const user = users[id]

  const templateVars = { urls: urlDatabase, user };
  res.render("urls_index", templateVars);
});
app.get("/urls/:shortURL", (req, res) => {
  const id = req.cookies["user_id"];
  const user = users[id]
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user };
  if(!urlDatabase[req.params.shortURL]) {
    res.send("short url does not exist");
  }
  res.render("urls_show", templateVars);
});
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console 
  const shortURL = generateRandomString()
  const longURL = req.body.longURL
  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: req.cookies["user_id"]
  }
  console.log(urlDatabase)
  res.redirect(`/urls/${shortURL}`);         // Respond with 'Ok' (we will replace this)
});
app.post("/urls/:shortURL/delete", (req, res) => {
  delete(urlDatabase[req.params.shortURL])
  urlDatabase[shortURL].longURL = req.body.longURL
res.redirect("/urls")
});
app.post("/urls/:shortURL/edit", (req, res) => {
  //console.log(req.body)
 // console.log(req.params)
  const shortURL = req.params.shortURL
  //console.log(urlDatabase)
  urlDatabase[shortURL] = req.body.longURL
  //console.log(urlDatabase[shortURL])
  //console.log(urlDatabase)

  res.redirect("/urls")
})
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
app.get("/login", (req, res) => {
  templateVars = { user: null}
  res.render("urls_login", templateVars)
})
app.post("/login", (req, res) => {
  const email = req.body.email
  const user = findUserByEmail(users, email);
  const id = user.id
  console.log(user)
  if(user && req.body.password === user.password) {
    res.cookie("user_id", id)
res.redirect("/urls")
  } else {
    res.status(403).send("Invalid login")
  
  }
})
app.post("/logout", (req, res) => {
  res.clearCookie("user_id")
  res.redirect("/urls")
})

app.get("/register", (req,res) => {
  templateVars = { user: null}
  res.render("urls_registration", templateVars)
})

app.post("/register", (req,res) => {
  const id = generateRandomString();
  const user = {
    id: id,
    email: req.body.email,
    password: req.body.password
  }
  if(req.body.email === "" || req.body.password === ""){
    res.status(400).send("Please leave no fields blank")
  }

  if(findUserinUsers(user,users )) {
    res.status(400).send("Credentials are taken")
  }

  
   users[id] = user
  res.cookie("user_id", id)
  res.redirect("/urls")
})


