// # /api/ai

import express from 'express';

//  Import the controller function that 
// takes user input => generate an AI playlist => save it => send it back to the frontend.
import { recommend } from '../../controllers/api/ai.js';

// Middleware that checks if a user is logged in (JWT verified in req.user)
// If not logged in => respond 401 Unauthorized
// import ensureLoggedIn from '../../config/ensureLoggedIn.js';

// Create a new Express Router (like a mini-server for just this path)
const router = express.Router();

// Middleware now applied at app level in app-server.js

// Define a POST route:  /api/ai/recommend
// When client POSTs here, run recommend controller
router.post('/recommend', recommend); 

export default router;