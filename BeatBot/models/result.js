import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const trackSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  why: {
    type: String,
    required: true
  }
}, { _id: false });

const metadataSchema = new Schema({
  ageGroup: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    required: true
  },
  activity: {
    type: String,
    required: true
  },
  energy: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  genres: [{
    type: String,
    required: true
  }]
}, { _id: false });

const resultSchema = new Schema({
  submission: {
    type: Schema.Types.ObjectId,
    ref: 'Submission',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  explanation: {
    type: String,
    required: true,
    trim: true
  },
  metadata: {
    type: metadataSchema,
    required: true
  },
  tracks: [{
    type: trackSchema,
    required: true
  }]
}, {
  timestamps: true
});

// Indexes for efficient querying
resultSchema.index({ user: 1, createdAt: -1 });
resultSchema.index({ submission: 1 });

export default mongoose.model('Result', resultSchema);

