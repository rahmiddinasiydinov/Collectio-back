const { signUser } = require("../lib/jwt");
const { userModel } = require("../model/user");
const bycript = require("bcrypt");
const User = {
  GET: async (req, res) => {
    try {
      const cookies = req.cookies;
      if (cookies?.user) {
        res.send({
          status: 200,
          user: cookies.user,
        });
      } else {
        res.send({
          status: 401,
          message: "Unauthorized",
          user: null,
        });
      }
    } catch (error) {
      console.log(error);
      res.send({
        status: 500,
        message: "Internal server error",
        user: null,
      });
    }
  },
  REGISTER: async (req, res) => {
    try {
      const { fullName, email, password, username } = req.body;
      const found = await userModel.findOne({ username });
      if (!found) {
        console.log(Number(process.env.SALT_ROUNDS));
        bycript.hash(
          password,
          Number(process.env.SALT_ROUNDS),
          async function (err, hash) {
            const newUser = new userModel({
              fullName,
              email,
              username,
              password: hash,
              createdAt: new Date().getTime(),
              updatedAt: new Date().getTime(),
            });
            const user = await newUser.save();
            const token = signUser({ username: user.username });
            res.cookie("token", token, {
              maxAge: 1000 * 60 * 60 * 24 * 7,
            });
            res.cookie(
              "user",
              {
                _id: user?._id,
                fullName: user?.fullName,
                isActive: user?.isActive,
                isAdmin: user?.isAdmin,
                username: user?.username,
              },
              {
                maxAge: 1000 * 60 * 60 * 24 * 7,
              }
            );
            res.send({
              status: 200,
              message: "Successfully registered",
              token,
            });
          }
        );
      } else {
        res.send({
          status: 400,
          message: "This username is taken",
        });
      }
    } catch (error) {
      console.log(error);
      res.send({
        status: 500,
        message: "Internal server error",
      });
    }
  },
  LOGIN: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await userModel.findOne({
        username,
      });
      if (user?.isActive === false) {
        res.send({
          status: 401,
          message: "You are blocked by admin",
        });
      }
      if (user && user?.isActive) {
        bycript.compare(password, user.password, function (err, result) {
          console.log(result);
          if (result) {
            const token = signUser(user.username);
            res.cookie("token", token, {
              maxAge: 1000 * 60 * 60 * 24 * 7,
            });
            res.cookie(
              "user",
              { _id:user?._id,
                fullName: user?.fullName,
                isActive: user?.isActive,
                isAdmin: user?.isAdmin,
                username: user?.username,
              },
              {
                maxAge: 1000 * 60 * 60 * 24 * 7,
              }
            );
            res.send({
              status: 200,
              message: "Logged in",
              token,
            });
          } else {
            res.send({
              status: 401,
              message: "Combination of Username and password is incorrect",
            });
          }
        });
      } else {
        res.send({
          status: 401,
          message: "Username or password is incorrect",
        });
      }
    } catch (error) {
      console.log(error);
      res.send({
        status: 500,
        message: "Internal server error",
      });
    }
  },
  LOGOUT: async (req, res) => {
    try {
      res.clearCookie('user');
      res.clearCookie("token");
      res.send({
        status: 200,
        message:'legged out'
      });
    } catch (error) {
      console.log(error);
      res.send('internal server error')
    }
  },
};

module.exports = {
  User,
};
