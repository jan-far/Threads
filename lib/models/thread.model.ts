import mongoose, { Model } from "mongoose";
import Community from "./community.model";

type BaseEntity = { id: string; name: string; image: string };
export interface ThreadDocument {
  text: string;
  author: BaseEntity & Record<string, any>;
  community: BaseEntity & Record<string, any>;
  parentId: string;
  children: Array<{ author: { image: string } }>;
  createdAt: Date;
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
