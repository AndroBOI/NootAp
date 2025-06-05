import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: String,
  body: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Note = mongoose.model('Note', noteSchema);

export default Note