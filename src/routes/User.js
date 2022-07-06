const { signUser } = require("../lib/jwt");
const { userModel } = require("../model/user");
const bycript = require("bcrypt");
const { uploader } = require("../utils/utils");
const User = {
  GET: async (req, res) => {
    try {
      const user = await userModel.findOne({ username: req?.user?.username.toString() });
        res.send({
          status: 200,
          user:user
        });

    } catch (error) {
      console.log(error);
      res.send({
        status: 500,
        message: "Internal server error",
        user: null,
      });
    }
  },
  GET_ALL: async (req, res) => {
    try {
      const user = await userModel.find({});
      res.send({
        status: 200, 
        data:user
      })
    } catch (error) {
       res.send({
         status: 500,
         message:'Internal server error',
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
            console.log('user');
            const token = signUser({ username: user.username });
            res.cookie("token", token, {
              maxAge: 1000 * 60 * 60 * 24 * 7,
              secure: true,
              httpOnly: true,
              sameSite: "none",
            });
          
            res.send({
              status: 200,
              message: "Successfully registered",
              token,
              data:{
                _id: user?._id, 
                fullName: user?.fullName, 
                username: user?.username,
                img:user?.img,
                isAdmin: user?.isAdmin,
                isActive:user?.isActive
              }
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
      } else if (user) {
        bycript.compare(password, user.password, function (err, result) {
          console.log(result);
          if (result) {
            const token = signUser({ username: user.username });
            res.cookie("token", token, {
              maxAge: 1000 * 60 * 60 * 24 * 7,
              secure: true,
              httpOnly: true, 
              sameSite:'none'
            });
            res.send({
              status: 200,
              message: "Logged in",
              token,
              data: {
                _id: user?._id, 
                fullName: user?.fullName, 
                username: user?.username,
                img:user?.img,
                isAdmin: user?.isAdmin,
                isActive:user?.isActive
              }
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
      res.cookie("token", {
        maxAge:0,
        secure: true,
        httpOnly: true,
        sameSite: "none",
      });
      res.send({
        status: 200,
        message: "legged out",
      });
    } catch (error) {
      console.log(error);
      res.send("internal server error");
    }
  },
  UPLOAD_IMAGE: async (req, res) => {
    try {
    console.log(req?.file);
      const response = await uploader(req.file.path);
      const user = await userModel.findOne({ username: req?.user?.username });
      console.log(user);
    user.img = response.url;
    const updatedUser = await user.save();
      res.send({
        status: 200,
        data:updatedUser,
      });
  } catch (error) {
    console.log(error);
    res.send({
      status: 500,
      message:"Internal server error",
    });
  }
  }
};

module.exports = {
  User,
};
