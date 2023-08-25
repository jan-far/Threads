import mongoose, { Model } from "mongoose";
import Community from "./community.model";
import Thread from "./thread.model";

interface UserDocument {
  id: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  threads: Array<typeof Thread>;
  onboarded: boolean;
  communities: Array<typeof Community>;
}

interface UserModel extends Model<UserDocument> {}

const userSchema = new mongoose.Schema<UserDocument, UserModel>({
  id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  bio: String,
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  onboarded: [{ type: Boolean, default: false }],
  communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }],
});

const User: Model<UserDocument> =
  mongoose.models.User ||
  mongoose.model<UserDocument, UserModel>("User", userSchema);

export default User;
