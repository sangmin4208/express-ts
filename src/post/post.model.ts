import mongoose from 'mongoose';
import Post from './post.interface';

const postSchema = new mongoose.Schema({
  author: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
  },
  content: String,
  title: String,
});

export default mongoose.model<Post & mongoose.Document>('Post', postSchema);
