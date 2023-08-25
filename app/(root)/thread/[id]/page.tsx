import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { getThreadById } from "@/lib/actions/thread.actions";
import { getUser } from "@/lib/actions/user.actions";
import { ThreadDocument } from "@/lib/models/thread.model";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();

  if (!user) return null;

  const userInfo = await getUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  const thread = (await getThreadById(params.id)) as ThreadDocument;

  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread?._id.toString()}
          id={thread?._id.toString() as string}
          currentUser={user?.id as string}
          parentId={thread?.parentId}
          content={thread?.text}
          author={thread?.author}
          community={thread?.community}
          comments={thread?.children}
          createdAt={thread?.createdAt}
        />
      </div>

      <div>
        <Comment
          threadId={thread?.id}
          currentUserImg={userInfo.image}
          currentUserId={userInfo._id.toString()}
        />
      </div>

      <div className="mt-10">
        {thread?.children.map((child: any) => {
          return (
            <ThreadCard
              key={child?._id.toString()}
              id={child?._id.toString() as string}
              currentUser={user?.id as string}
              parentId={child?.parentId}
              content={child?.text}
              author={child?.author}
              community={child?.community}
              comments={child?.children}
              createdAt={child?.createdAt}
              isComment
            />
          );
        })}
      </div>
    </section>
  );
};

export default Page;
