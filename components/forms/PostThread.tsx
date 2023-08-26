"use client";

import { threadValidation } from "@/lib/validations/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { createThread } from "@/lib/actions/thread.actions";
import { useOrganization } from "@clerk/nextjs";

const PostThread = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();
  const form = useForm({
    resolver: zodResolver(threadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });

  console.log("====================================");
  console.log(organization?.id);
  console.log("====================================");

  const onSubmit = async (values: z.infer<typeof threadValidation>) => {
    await createThread({
      text: values.thread,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
    });

    router.push("/");
  };

  return (
    <>
      <h1>Post Thread form</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-10 flex flex-col justify-start gap-10"
        >
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full">
                <FormLabel className="text-base-semibold text-light-2">
                  Comment
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={15}
                    className="border border-dark-4 bg-dark-3 text-light-1 no-focus"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="bg-primary-500">
            Post Thread
          </Button>
        </form>
      </Form>
    </>
  );
};

export default PostThread;
