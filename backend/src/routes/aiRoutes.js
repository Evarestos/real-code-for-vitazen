import express from 'express';
import aiController from '../controllers/aiController';

const router = express.Router();

router.post('/chat', aiController.generateResponse);
router.post('/generate-workout', aiController.generateWorkoutProgram);

export default router;
