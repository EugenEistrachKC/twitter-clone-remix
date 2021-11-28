import { Tweet, User } from ".prisma/client";
import { LoaderFunction, useLoaderData } from "remix";
import TweetLists from "~/components/tweetList";
import { db } from "~/utils/db.server";

type LoaderData = {
  tweets: (Tweet & { user?: User })[];
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData | Response> => {
  const tweets = await db.tweet.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return { tweets };
};

export default function Tweets() {
  const loaderData = useLoaderData<LoaderData>();

  return <TweetLists tweets={loaderData?.tweets || []} />;
}
