// server/config/seed.js
// Database seeding script for music recommendation app
// This script populates the database with sample users, submissions, and results

import dotenv from 'dotenv';
import './database.js';
import User from '../models/user.js';
import Submission from '../models/submission.js';
import Result from '../models/result.js';

dotenv.config();

(async function() {

 // Clear existing data from all collections
 await User.deleteMany({});
 
 // Create sample users with encrypted passwords
 const users = await User.create([
   { name: "Alice", email: "alice@example.com", password: "password123" },
   { name: "Bob", email: "bob@example.com", password: "password123" }
 ]);

 // Clear existing submissions
 await Submission.deleteMany({});
 
 // Create sample music preference submissions
 const submissions = await Submission.create([
   {
     user: users[0]._id,
     ageGroup: '18-29',
     mood: 'energetic',
     activity: 'workout',
     energy: 'high',
     genres: ['hip-hop', 'electronic'],
     language: 'english',
     count: 10
   },
   {
     user: users[1]._id,
     ageGroup: '30-44',
     mood: 'chill',
     activity: 'studying',
     energy: 'low',
     genres: ['jazz', 'ambient'],
     language: 'any',
     count: 5
   }
 ]);

 // Clear existing results
 await Result.deleteMany({});
 
 // Create sample playlist results based on the submissions
 const results = await Result.create([
   {
     submission: submissions[0]._id,
     user: users[0]._id,
     title: 'High-Energy Workout Mix',
     explanation: 'Upbeat tracks to keep your pace during workouts.',
     metadata: {
       ageGroup: '18-29',
       mood: 'energetic',
       activity: 'workout',
       energy: 'high',
       language: 'english',
       genres: ['hip-hop', 'electronic']
     },
     tracks: [
       { title: 'Stronger', artist: 'Kanye West', why: 'High BPM and motivation' },
       { title: 'Titanium', artist: 'David Guetta ft. Sia', why: 'Energetic chorus' }
     ]
   },
   {
     submission: submissions[1]._id,
     user: users[1]._id,
     title: 'Mellow Study Session',
     explanation: 'Calm instrumentals for focus without lyrics.',
     metadata: {
       ageGroup: '30-44',
       mood: 'chill',
       activity: 'studying',
       energy: 'low',
       language: 'any',
       genres: ['jazz', 'ambient']
     },
     tracks: [
       { title: 'Take Five', artist: 'The Dave Brubeck Quartet', why: 'Iconic cool jazz' },
       { title: 'Weightless', artist: 'Marconi Union', why: 'Relaxing ambient textures' }
     ]
   }
 ]);

 // Log the created results for verification
 console.log('Seeding completed successfully!');
 console.log(`Created ${users.length} users, ${submissions.length} submissions, and ${results.length} results`);

 // Exit the process
 process.exit();

})();