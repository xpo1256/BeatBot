// routes/api/submissions.js
import express from 'express';
import ensureLoggedIn from '../../config/ensureLoggedIn.js';
import { index, show, create, update, destroy, listResults } from '../../controllers/api/submissions.js';

const router = express.Router();

// protect all routes
router.use(ensureLoggedIn);

router.get('/', index);
router.post('/', create);
router.get('/:id', show);
router.put('/:id', update);
router.delete('/:id', destroy);
router.get('/:id/results', listResults);

export default router;