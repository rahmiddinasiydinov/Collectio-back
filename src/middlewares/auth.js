const { verifyUser } = require("../lib/jwt");
const auth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (cookies?.token) {
      const user = verifyUser(cookies?.token);
       
      if (user) {
        req.user = user
        next();
      } else {
        res.clearCookie("token");
        res.send({
          status: 401,
          message: "Unauthorized 1",
          user: null,
        });
      }
    } else {
         res.clearCookie("token");
      res.send({
        status: 401,
        message: "You session is expired, please login",
        user: null,
      });
    }
  } catch (error) {
      console.log(error);
    res.send({
      status: 401,
      message: "Unauthorized 3",
      user: null,
    });
  }
};
module.exports = {
  auth,
};
