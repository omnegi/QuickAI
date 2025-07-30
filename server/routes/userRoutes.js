import express from 'express';
import { auth } from '../middlewares/auth.js';
import { getPublishedCreation, getUserCreation, toggleLikeCreation, getPdfSummaries } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/get-user-creation', auth,getUserCreation);
userRouter.get('/get-published-creation', auth,getPublishedCreation);
userRouter.post('/toggle-like-creation', auth,toggleLikeCreation);
userRouter.get('/get-pdf-summaries', auth, getPdfSummaries);

export default userRouter;
