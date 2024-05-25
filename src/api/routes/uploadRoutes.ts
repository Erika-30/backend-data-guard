import express from "express";
import multer from "multer";
import { authMiddleware } from "../middlewares/authMiddleware";
import { uploadCsv } from "../controllers/uploadController";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadRouter = express.Router();

uploadRouter.post("/upload", authMiddleware, upload.single("file"), uploadCsv);

export default uploadRouter;
