const express = require('express');
const controller = require("../controller/controller");
const validator = require('../validator/validate');
const router = express.Router();


router.get("/user/getAll",controller.controllerGet);
router.post("/user/create", validator.createPostValidator ,controller.controllerPost);
router.put("/user/edit/:id",validator.createPostValidator, controller.controllerPut);
router.delete("/user/del",controller.controllerDelete);
router.delete("/user/delete",controller.controllerDeleteOne);
 
module.exports = router;