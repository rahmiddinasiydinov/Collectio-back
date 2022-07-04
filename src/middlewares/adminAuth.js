const { userModel } = require("../model/user");

const authAdmin = async (req, res, next) => {
 try {
     const user = await userModel.findOne({ username: req?.user?.username});
      
   if (user?.isAdmin) {
       if(user?.isActive)
         next();
       else res.send({
         status: 401,
         message: 'You are bloked', 
         data:null
     })
   }else if (!user) {
     res.send({
       status: 401,
       message: "Your account is deleted",
       data: user,
     });
   } else {
       res.send({
         status: 401,
         message: "You are not admin",
         data: user,
       });
     }
 } catch (error) {
     console.log(error);
      res.send({
        status: 500,
        message: "Internal server error2",
      });
 }
};
module.exports = {
  authAdmin,
};
