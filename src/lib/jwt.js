const { verify, sign } = require("jsonwebtoken"); ;
const SECRET_KEY = '${process.env.SECRET_KEY}';
function signUser(username) {
  return sign(username, SECRET_KEY);
}
function verifyUser(token){
  return verify(token, SECRET_KEY);
}
module.exports = {
  signUser, verifyUser
}
