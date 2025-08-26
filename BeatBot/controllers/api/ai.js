// # call OpenAI, persist result
import Submission from '../../models/submission.js';
import Result from '../../models/result.js';

// loads the OPENAI API from .env 
const apiKey = process.env.OPENAI_API_KEY;

function validateData(body) {
    return {
        ageGroup: body.ageGroup,     // e.g. 'under-12' | '13-17' | '18-29' | ...
        mood: body.mood,             // e.g. 'happy', 'chill', 'sad'
        activity: body.activity,     // e.g. 'studying', 'working', 'workout'
        energy: body.energy,         // 'low', 'medium', 'high'
        // only keep up to 8 genres, in case user sends too many
        genres: Array.isArray(body.genres) ? body.genres.slice(0, 8) : [],
        // default to any language if not set 
        language: body.language || 'any',
        // tracks between 3 and 20 
        count: Math.max(3, Math.min(20, Number(body.count) || 10))
    };
}

// Ask OpenAI to generate a playlist based on the validateData preferences
async function getPlaylist(prefs) {
    // Prompt that tells the AI exactly how to behave
    const prompt = `You are a music recommendation engine. You only produce music recommendations.

Output strictly as a single JSON object with the keys:
- "title"
- "explanation"
- "tracks": array of { "title", "artist", "why" }
- "metadata": { "ageGroup", "mood", "activity", "energy", "language", "genres": [] }

Rules:
- If ageGroup is "under-12" or "13-17", avoid explicit content; prefer clean/radio edits.
- Match energy to tempo/intensity.
- Align tracks to activity.
- Prefer requested genres/language; mix compatible styles if "any".
- Keep number of tracks <= requested "count".
- Return valid JSON only.`;

// User prompt: inserts the actual answers from the form
const user = `Please generate a playlist using these preferences:
ageGroup: ${prefs.ageGroup}
mood: ${prefs.mood}
activity: ${prefs.activity}
energy: ${prefs.energy}
genres: ${prefs.genres?.length ? prefs.genres.join(", ") : "[]"}
language: ${prefs.language}
count: ${prefs.count}

Return only the JSON object as specified in the system instructions.`;

// Call the OpenAI Chat Completions API
const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${apiKey}`, // pulls the key from the .env
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        model: "gpt-4o-mini",   
        temperature: 0.6,     
        messages: [
            { role: "system", content: prompt }, // AI behavior
            { role: "user", content: user }      // user input
        ]
    })
});

  // Convert response to JSON
  const data = await response.json();

  // If API returned an error, throw it
  if (!response.ok) {
    throw new Error(data?.error?.message || 'OpenAI request failed');
  }

  // Parse the text returned into JSON
  let json;
  try {
    json = JSON.parse(data.choices[0].message.content);
  } catch (e) {
    console.error("OpenAI returned non-JSON:", data.choices?.[0]?.message?.content);
    throw e;
  }
  return json;
}

// Controller that Express route will call: POST /api/ai/recommend
// function that takes user input => generate an AI playlist => save it => send it back to the frontend.
export async function recommend(req, res) {
  try {
    // Takes the request body (the answers from your React form)
    // Passes it through validateData to make sure values are valid
    const prefs = validateData(req.body);

    // Calls the helper function getPlaylist, which sends the preferences to OpenAI.
    // AI responds with a playlist JSON (title, explanation, tracks, metadata).
    const playlist = await getPlaylist(prefs);

    // If the user is logged in (req.user set by JWT), save the request + result in the database
    const userId = req.user?._id;
    let submissionId;
    if (userId) {
      try {
        // Creates a new Submission document => stores what the user asked for (their form answers)
        const submission = await Submission.create({
      user: userId,
      ageGroup: prefs.ageGroup,
      mood: prefs.mood,
      activity: prefs.activity,
      energy: prefs.energy,
      genres: prefs.genres,
      language: prefs.language,
      count: prefs.count
    });
    submissionId = submission._id;

        // Creates a new Result document => stores what the AI responded with (the playlist)
        await Result.create({
      submission: submission._id,
      user: userId,
      title: playlist.title,
      explanation: playlist.explanation,
      metadata: playlist.metadata,
      tracks: playlist.tracks
    });
  } catch (dbErr) {
    console.error('Failed to persist submission/result:', dbErr);
      }
    }
    // If saved, return the playlist plus submissionId.
    return res.json(submissionId ? { ...playlist, submissionId } : playlist);
  } catch (err) {
    console.error("recommend error:", err);
    res.status(500).json({ error: "recommendation_failed" });
  }
}