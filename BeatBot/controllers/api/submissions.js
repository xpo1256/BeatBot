// # /api/submissions controller

// Import the Submission model (represents user form submissions)
import Submission from '../../models/submission.js';
// Import the Result model (represents AI responses tied to a submission)
import Result from '../../models/result.js';


// GET /api/submissions
// Return all submissions for the logged-in user
export async function index(req, res) {
  try {
    // Extract logged-in user id from JWT (set by checkToken middleware)
    const userId = req.user?._id;

    // Find all submissions that belong to this user
    // .sort({ createdAt: -1 }) => newest first
    // .lean() => plain JS objects instead of full Mongoose docs (faster, lighter)
    const submissions = await Submission.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    // Respond with the list of submissions as JSON
    res.json(submissions);
  } catch (err) {
    // If something goes wrong, return a 500 error with details
    res.status(500).json({ message: 'Failed to fetch submissions', error: err.message });
  }
}


// GET /api/submissions/:id
// Return one submission and all its results
export async function show(req, res) {
  try {
    const userId = req.user?._id;

    // Find a single submission that matches the id AND belongs to this user
    const submission = await Submission.findOne({ _id: req.params.id, user: userId }).lean();

    // If not found, return a 404
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    // Find all results tied to this submission, newest first
    const results = await Result.find({ submission: submission._id })
      .sort({ createdAt: -1 })
      .lean();

    // Respond with submission object plus results
    res.json({ ...submission, results });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch submission', error: err.message });
  }
}


// POST /api/submissions
// Create a new submission
export async function create(req, res) {
  try {
    const userId = req.user?._id;

    // Build the submission payload, attach user id
    const payload = { ...req.body, user: userId };

    // Create and save in DB
    const submission = await Submission.create(payload);

    // Return 201 Created + the new submission
    res.status(201).json(submission);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create submission', error: err.message });
  }
}

// PUT /api/submissions/:id
// Update an existing submission
export async function update(req, res) {
  try {
    const userId = req.user?._id;

    // Find submission by id + user, and update with req.body
    const updated = await Submission.findOneAndUpdate(
      { _id: req.params.id, user: userId }, // filter: only this user's submission
      req.body,                             // update with this new data
      { new: true, runValidators: true }    // return updated doc + enforce schema validation
    );

    // If no document found, return 404
    if (!updated) return res.status(404).json({ message: 'Submission not found' });

    // Return the updated submission
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update submission', error: err.message });
  }
}

// DELETE /api/submissions/:id
// Delete a submission
export async function destroy(req, res) {
  try {
    const userId = req.user?._id;

    // Find and delete submission belonging to this user
    const deleted = await Submission.findOneAndDelete({ _id: req.params.id, user: userId });

    // If not found, return 404
    if (!deleted) return res.status(404).json({ message: 'Submission not found' });

    // Return 204 No Content (deletion successful, nothing else to send)
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete submission', error: err.message });
  }
}

// GET /api/submissions/:id/results
// Get only the results for a submission
export async function listResults(req, res) {
  try {
    const userId = req.user?._id;

    // First, check that the submission exists and belongs to this user
    const exists = await Submission.exists({ _id: req.params.id, user: userId });

    if (!exists) return res.status(404).json({ message: 'Submission not found' });

    // If it exists, get all results tied to this submission
    const results = await Result.find({ submission: req.params.id })
      .sort({ createdAt: -1 })
      .lean();

    // Return results as JSON
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch results', error: err.message });
  }
}

// Export all functions for router usage
export default { index, show, create, update, destroy, listResults };