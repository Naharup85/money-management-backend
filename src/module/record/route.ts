import { Router } from "express";
import * as RecordController from "./controller.js"
import validate from "../../common/middleware/dto.middleware.js";
import { recordSchema } from "./dto.js";


const router=Router();

router.post("/",validate(recordSchema),RecordController.createRecord);
router.get("/",RecordController.getAllRecords);
router.patch("/:id",validate(recordSchema),RecordController.updateRecord);
router.get("/:id",RecordController.getRecord);
router.delete("/:id",RecordController.deleteRecord);



export default router;