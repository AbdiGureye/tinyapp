const express = require("express");
const app = express();
const PORT = 8080; 
const cookieSession = require('cookie-session')
const {findUserByEmail, findUserinUsers, urlsForUser} = require("./helpers")


const bcrypt = require('bcryptjs');

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
function generateRandomString() {
return Math.random().toString(36).slice(5) 
}
app.use(cookieSession({
  name: 'session',
  secret: "mileycyrus",
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

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



app.get("/", (req, res) => {
  res.send("Hello!");
});
//shows current database
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
// renders urls_new template
app.get("/urls/new", (req, res) => {
  const id = req.session.user_id;
  const user = users[id]
  // if user is not logged in redirect to login
  if(!user) {
    res.redirect("/login")
  }

  templateVars = {user}
  res.render("urls_new", templateVars);
});

// renders the show page (urls_show) for specific short url 
app.get("/urls/:shortURL", (req, res) => {
  const id = req.session.user_id;
  const user = users[id]
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user };
  // error handling for if the short url inputed doesnt exist 
  if(!urlDatabase[req.params.shortURL]) {
    res.send("short url does not exist");
  }
  res.render("urls_show", templateVars);
});

// renders urls_index template
app.get("/urls", (req, res) => {
  
  const id = req.session.user_id;
  console.log("id from urls get route",id)
  const user = users[id]
  const userURLS = urlsForUser(id, urlDatabase)

  const templateVars = { urls: userURLS, user };
  res.render("urls_index", templateVars);
});
// redirects to the longURL
app.get('/u/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    res.redirect(urlDatabase[req.params.shortURL].longURL);
  } else {
    res.send("This url isnt in the database");
  }
});


// form that handles the new url inputed (form in urls_) 
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console 
  const shortURL = generateRandomString()
  const longURL = req.body.longURL
  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: req.session.user_id
  }
  console.log(urlDatabase)
  res.redirect(`/urls/${shortURL}`);         // Respond with 'Ok' (we will replace this)
});
// resposible for deleting the specified short url (form in urls_index)
app.post("/urls/:shortURL/delete", (req, res) => {
  const id = req.session.user_id;
  // checks if user has permission to delete url
  if(id && id === urlDatabase[req.params.shortURL].userID) {
    delete(urlDatabase[req.params.shortURL])
    urlDatabase[shortURL].longURL = req.body.longURL
    res.redirect("/urls")
  } else {
    res.status(404).send("You have no access to delete this url")
  }
  
});
// resposible for editing the specified short url (form in urls_show)
app.post("/urls/:shortURL/edit", (req, res) => {
  const id = req.session.user_id
  //console.log(req.body)
 // console.log(req.params)
  const shortURL = req.params.shortURL
  //console.log(urlDatabase)
  if(id && id === urlDatabase[req.params.shortURL].userID) {
  urlDatabase[shortURL] = req.body.longURL
  //console.log(urlDatabase[shortURL])
  //console.log(urlDatabase)
  res.redirect("/urls")
} else {
  res.status(404).send("You have no access to edit this url")
}
})
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
//renders login template
app.get("/login", (req, res) => {
  templateVars = { user: null}
  res.render("urls_login", templateVars)
})
//sets id to session and logs user in 
app.post("/login", (req, res) => {
  const email = req.body.email
  // helper function to find if email is in database
  const user = findUserByEmail(users, email);
  const id = user.id
  // checks if password matches the email and if user exists
  if(user && bcrypt.compareSync(req.body.password, user.password)) {
    req.session.user_id =  id
res.redirect("/urls")
  } else {
    res.status(403).send("Invalid login")
  
  }
})
app.post("/logout", (req, res) => {
  req.session.user_id = null;
  
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
    password: bcrypt.hashSync(req.body.password, 10)
  }
  if(req.body.email === "" || req.body.password === ""){
    res.status(400).send("Please leave no fields blank")
  }

  if(findUserinUsers(user,users )) {
    res.status(400).send("Credentials are taken")
  }

  
   users[id] = user
  //  console.log(id)
  req.session.user_id = id
  // console.log("req.session.user_id", req.session.user_id)
  
  res.redirect("/urls")
})


