import mongoose, { Model } from "mongoose";
import User from "./user.model";
import Thread from "./thread.model";

interface CommunityDocument {
  id: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  createdBy: typeof User;
  threads: Array<typeof Thread> | Array<Record<string, unknown>>;
  members: Array<typeof User> | Array<Record<string, unknown>>;
}

interface CommunityModel extends Model<CommunityDocument> {}

const communitySchema = new mongoose.Schema<CommunityDocument, CommunityModel>({
  id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  bio: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Community: Model<CommunityDocument> =
  mongoose.models.Community ||
  mongoose.model<CommunityDocument, CommunityModel>(
    "Community",
    communitySchema
  );

export default Community;
