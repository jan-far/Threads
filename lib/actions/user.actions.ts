"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

interface IUserData {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
}

export const updateUser = async (
  userData: IUserData & { path: string }
): Promise<void> => {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userData.userId },
      {
        ...userData,
        username: userData.username.toLowerCase(),
        onboarded: true,
      },
      { upsert: true }
    );

    if (userData.path === "/profile/edit") {
      revalidatePath(userData.path);
    }
  } catch (error: any) {
    console.log(`Error updating user: ${error.message}`);
  }
};

export const getUser = async (userId: string) => {
  try {
    connectToDB();

    return await User.findOne({ id: userId });
  } catch (error: any) {
    console.log(`Error getting user: ${error.message}`);
  }
};

export const getUserPosts = (userId: string) => {
  try {
    connectToDB();

    const threads = User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "naeme image id",
        },
      },
    });
    return threads;
  } catch (error: any) {
    throw new Error(`Error getting user posts: ${error.message}`);
  }
};

export const getUsers = async ({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) => {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = { id: { $ne: userId } };

    if (searchString.trim() === "") {
      query.$or = [
        {
          username: { $regex: regex },
        },
        {
          name: { $regex: regex },
        },
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const userQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);
    const totalUserCount = await User.countDocuments(query);

    const users = await userQuery.exec();

    const isNext = totalUserCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Error getting users: ${error.message}`);
  }
};

export const getActivity = async (userId: string) => {
  try {
    connectToDB();
    const userThreads = await Thread.find({ author: userId });

    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "_id name image",
    });

    return replies;
  } catch (error: any) {
    throw new Error(`Error getting activity: ${error.message}`);
  }
};
