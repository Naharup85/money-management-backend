import { Router } from "express";
import * as RecordController from "./controller.js"


const router=Router();

router.post("/",RecordController.createRecord);
router.get("/",RecordController.getAllRecords);
router.patch("/:id",RecordController.updateRecord);
router.get("/:id",RecordController.getRecord);
router.delete("/:id",RecordController.deleteRecord);



export default router;