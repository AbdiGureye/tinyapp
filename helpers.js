const findUserinUsers = function(userInput, usersDB) {
  for(let user in usersDB) {
    if(userInput.email === usersDB[user].email) {
      if(userInput.password === usersDB[user].password) {
        return true;
      }
    }
  }
  return null;
}

const findUserByEmail = function(usersObj, email) {
  for(let user in usersObj) {
    if(email === usersObj[user].email) {
      
        return usersObj[user];
    }
  }
  return undefined;
}

const urlsForUser = function(id, urlDatabase) {
  const userURLS = {}
  for(let shortURL in urlDatabase) {
    if(id === urlDatabase[shortURL].userID) {
      userURLS[shortURL] = {
        longURL: urlDatabase[shortURL].longURL,
        userID: id
      }
    }
  }
  return userURLS
}

module.exports = {
  findUserinUsers,
  findUserByEmail,
  urlsForUser
}