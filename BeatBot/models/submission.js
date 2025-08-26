import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ageGroup: {
    type: String,
    required: true,
    enum: ['13-17', '18-29', '30-44', '45-59', '60+']
  },
  mood: {
    type: String,
    required: true,
    enum: ['energetic', 'chill', 'happy', 'sad', 'focused', 'romantic', 'angry', 'nostalgic']
  },
  activity: {
    type: String,
    required: true,
    enum: ['workout', 'studying', 'driving', 'relaxing', 'party', 'work', 'sleep', 'cooking']
  },
  energy: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high']
  },
  genres: [{
    type: String,
    required: true,
    enum: ['rock', 'pop', 'hip-hop', 'electronic', 'jazz', 'classical', 'country', 'r&b', 'reggae', 'blues', 'folk', 'ambient', 'metal', 'punk', 'indie', 'latin', 'world']
  }],
  language: {
    type: String,
    required: true,
    enum: ['english', 'spanish', 'french', 'german', 'italian', 'portuguese', 'japanese', 'korean', 'chinese', 'any']
  },
  count: {
    type: Number,
    required: true,
    min: 1,
    max: 50,
    default: 10
  }
}, {
  timestamps: true
});

// Index for efficient querying
submissionSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Submission', submissionSchema);
