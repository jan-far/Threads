import ThreadCard from "@/components/cards/ThreadCard";
import { getThreads } from "@/lib/actions/thread.actions";
import { UserButton, currentUser } from "@clerk/nextjs";

const Home = async () => {
  const results = await getThreads(1, 30);
  const user = await currentUser();
  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {results.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {results.posts.map((post) => (
              <ThreadCard
                key={post._id.toString()}
                id={post._id.toString()}
                currentUser={user?.id as string}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                comments={post.children}
                createdAt={post.createdAt}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
};

export default Home;
