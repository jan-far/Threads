import mongoose, { Model } from "mongoose";

export interface ThreadDocument {
  text: string;
  author: mongoose.Types.ObjectId | Record<string, unknown>;
  community: mongoose.Types.ObjectId | Record<string, unknown>;
  parentId: string;
  children: Array<mongoose.Types.ObjectId> | Array<Record<string, any>>;
  createdAt: Date | string;
}

interface ThreadModel extends Model<ThreadDocument> {}

const threadSchema = new mongoose.Schema<ThreadDocument, ThreadModel>({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
  parentId: String,
  children: [{ type: mongoose.Schema.Types.ObjectId, red: "Thread" }],
  createdAt: { type: Date, default: new Date() },
});

const Thread: Model<ThreadDocument> =
  mongoose.models.Thread ||
  mongoose.model<ThreadDocument, ThreadModel>("Thread", threadSchema);

export default Thread;
