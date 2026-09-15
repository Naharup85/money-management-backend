import { Router } from "express"
import * as userController from "./controller.js"
import validate from "../../common/middleware/dto.middleware.js";
import {loadCurrentUser} from "../../common/middleware/current-user.middleware.js"

import { registerDto, updateDto } from "./dto.js";

const router = Router();


router.post("/register",validate(registerDto), userController.register);
router.get("/profile",loadCurrentUser,  userController.getUser)
router.patch("/update",loadCurrentUser,validate(updateDto),userController.updateUser)
router.delete("/delete",loadCurrentUser,userController.deleteUser);

export default router;

