const { signUser } = require("../lib/jwt");
const { userModel } = require("../model/user");

const auth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (cookies?.token && cookies?.user) {
      const username = cookies?.user?.username;
      const user = await userModel.findOne({ username });
      if (user) {
        next();
      } else {
        res.clearCookie("token");
        res.clearCookie("user");
        res.send({
          status: 401,
          message: "Unauthorized 1",
          user: null,
        });
      }
    } else {
         res.clearCookie("token");
         res.clearCookie("user");
      res.send({
        status: 401,
        message: "Unauthorized 2",
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
