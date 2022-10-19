import { Schema, model } from 'mongoose';

import PostInterface from '@/resources/post/post.interface';

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<PostInterface>('Post', PostSchema);
