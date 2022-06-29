const { Router } = require("express");
const { Collection } = require("./Collection");
const { Cookies } = require("./Cookies");
const { Item } = require("./Item") ;
const router = Router();
const { upload} =require('../middlewares/multer');
const { User } = require("./User");
const { Tag } = require('./Tags');
const {auth} = require('../middlewares/auth')
router.get("/collection", Collection.GET);
router.get("/collection_all", Collection.GET_ALL);
router.get("/my_collections", Collection.GET_BY_USER);
router.get("/my_items", Item.GET_BY_USER);
router.get("/item", Item.GET);
router.get("/item_all", Item.GET_ALL);
router.get('/user', auth, User.GET);
router.get("/one_collection", Collection.GETONE);
router.get("/one_item", Item.GETONE);
router.get("/language", Cookies.GET_LANG);
router.get('/theme', Cookies.GET_THEME);
router.get("/tags", Tag.GET);
router.get("/logout", User.LOGOUT);
router.post("/collection", upload.single("img"), Collection.POST);
router.post("/item", upload.single("img"), Item.POST);
router.post('/register', User.REGISTER);
router.post('/login', User.LOGIN)
module.exports = { router };