import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

import checkToken from './config/checkToken.js';
import ensureLoggedIn from './config/ensureLoggedIn.js';
import userRoutes from './routes/api/users.js';
import aiRoutes from './routes/api/ai.js';
import submissionsRoutes from './routes/api/submissions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    res.locals.data = {}
    next()
})

// health 
app.get('/health', (_, res) => res.status(200).json({ ok: true }));
// make req.user available
app.use(checkToken);
// API Routes - these must come before the static file serving
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/submissions', ensureLoggedIn, submissionRoutes);

// Determine which directory to serve static files from
const staticDir = process.env.NODE_ENV === 'production' ? 'dist' : 'public';
const indexPath = process.env.NODE_ENV === 'production' ? 'dist/index.html' : 'index.html';

// Serve static files from the appropriate directory
app.use(express.static(staticDir));

// For React Router - serve index.html for all non-API routes
app.get(/.*/, (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // Serve the React app for all other routes
    res.sendFile(path.resolve(path.join(__dirname, indexPath)));
});

export default app;