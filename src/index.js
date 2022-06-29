const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const { router } = require("./routes/index");
const cookieParser = require("cookie-parser");
const { itemModel } = require("./model/item");
const { Schema } = require("mongoose");
const { commentModel } = require("./model/comment");

dotenv.config();

app.use(cookieParser());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect(`${process.env.MONGODB}`, () => {
  console.log("MongoDB is connected");
});
app.use("/", router);

io.on("connection", (socket) => {
  socket.on("new-like", async (data) => {
    const { userId, itemId } = data;

    try {
      const item = await itemModel.findOne({ _id: itemId });

      if (item?.likes.includes(userId)) {
        const likes = item?.likes?.filter((e) => e.toString() !== userId);
        item.likes = likes;
        await item.save();
        const newItem = await itemModel
          .findOne({ _id: itemId })
          .populate("user")
          .populate("collectionName");
        socket.broadcast.emit("server-like", newItem);
        socket.emit("server-like", newItem);
      } else {
        item.likes.push(userId);
        const dislikes = item.dislikes?.filter((e) => e.toString() !== userId);
        item.dislikes = dislikes;
        await item.save();
        const newItem = await itemModel
          .findOne({ _id: itemId })
          .populate("user")
          .populate("collectionName");
        socket.broadcast.emit("server-like", newItem);
        socket.emit("server-like", newItem);
      }
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("new-dislike", async ({ userId, itemId }) => {
    try {
      const item = await itemModel.findOne({ _id: itemId });
      if (item.dislikes.includes(itemId)) {
        const dislikes = item.dislikes?.filter((e) => e.toString() !== userId);
        item.dislikes = dislikes;
        await item.save();
        const newItem = await itemModel
          .findOne({ _id: itemId })
          .populate("user")
          .populate("collectionName");
        socket.broadcast.emit("server-dislike", newItem);
        socket.emit("server-dislike", newItem);
      } else {
        item.dislikes.push(userId);
        const likes = item.likes?.filter((e) => e.toString() !== userId);
        item.likes = likes;
        await item.save();
        const newItem = await itemModel
          .findOne({ _id: itemId })
          .populate("user")
          .populate("collectionName");
        socket.broadcast.emit("server-dislike", newItem);
        socket.emit("server-dislike", newItem);
      }
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("new-comment", async ({ userId, itemId, comment }) => {
    const newComment = new commentModel({
      user: userId,
      body: comment,
      createdAt: new Date().getTime(),
    });
    const response = await newComment.save();
    const item = await itemModel.findOne({ _id: itemId });
    item.comments.unshift(response._id);
    await item.save();
    const newItem = await itemModel
      .findOne({ _id: itemId })
      .populate("user")
      .populate("collectionName")
      .populate({ path: "comments", populate: { path: "user" } });
    socket.broadcast.emit("server-comment", newItem);
    socket.emit("server-comment", newItem);
  });
});

server.listen(process.env.PORT, () => {
  console.log("server is running");
});
