const { userModel } = require("../model/user");

const Admin = {
  TOOGLE_USER_STATUS: async (req, res) => {
    try {
      const { id } = req.query;
      const foundUser = await userModel.findOne({ _id: id });
      foundUser.isActive = !foundUser.isActive;
      await foundUser.save();
      const allUsers = await userModel.find();
      res.send({
        status: 200,
        data: allUsers,
      });
    } catch (error) {
      res.send({
        status: 500,
        data: "Internal server error",
      });
    }
  },
  TOOGLE_ADMIN_STATUS: async (req, res) => {
    try {
      const { id } = req.query;
      const foundUser = await userModel.findOne({ _id: id });
      foundUser.isAdmin = !foundUser.isAdmin;
      await foundUser.save();
      const allUsers = await userModel.find();
      res.send({
        status: 200,
        data: allUsers,
      });
    } catch (error) {
      res.send({
        status: 500,
        data: "Internal server error",
      });
    }
  },
  DELETE: async (req, res) => {
    try {
      const { Ids } = req.query;
      console.log(Ids);
      const users = await userModel.find();
      const filtered = users.filter((e) => Ids?.includes(e?._id));
      filtered?.map(async (e) => {
        await userModel.findOneAndDelete({ _id: e });
      });
      const allUsers = await userModel.find();
      res.send({
        status: 200,
        message: "Deleted successfully",
      });
    } catch (error) {
      res.send({
        status: 500,
        data: "Internal server error",
      });
    }
  },
  VIEW_AS: async (req, res) => {
    try {
        const { userId } = req.query;
        console.log(userId, req?.user?.username);
      const user = await userModel.findOne({ _id: userId });
      const admin = await userModel.findOne({
        username: req?.user?.username,
      });
        res.send({
            status: 200, 
            user,
            admin
        })
    } catch (error) {
        res.send({
            status: 500, 
            message:'Internal server error'
        })
    }
  },
};
module.exports = {
  Admin,
};
