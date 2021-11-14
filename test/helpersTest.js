const { assert } = require('chai');

const { findUserByEmail, findUserinUsers, urlsForUser } = require('../helpers.js');

const testUsers = {
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
const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "userRandomID"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "user2RandomID"
  }
};

describe('findUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserByEmail(testUsers, "user@example.com")
    const expectedUser = testUsers["userRandomID"];
    // Write your assert statement here
    assert.deepEqual(expectedUser, user)
  });
  it('should return undefined', function() {
    const user = findUserByEmail(testUsers, "user3@example.com") 
    const expectedUser = undefined;
    assert.equal(expectedUser, user)
  })
});

describe('findUserInUsers', function() {
  it('should return true with user in database', function() {
    const userInput = {
      email: "user@example.com", 
      password: "purple-monkey-dinosaur"
    }
    const input = findUserinUsers(userInput, testUsers)
    const expectedOutput = true
    assert.equal(expectedOutput, input)
  })
  it("should return null with user thats not in database", function() {
    const userInput = {
      email: "user2@example.com", 
      password: "puple-monkey-dinosaur"
    }
    const input = findUserinUsers(userInput, testUsers)
    const expectedOutput = null
    assert.equal(expectedOutput, input)
  })
});

describe('urlsForUser', function() {
  it("should return urls for user", function() {
    const userURLS = urlsForUser("userRandomID", urlDatabase)
    const expectedResult ={ b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "userRandomID"
    }};
    assert.deepEqual(expectedResult, userURLS)
  })
})