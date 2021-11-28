import { Tweet } from "@prisma/client";
import TweetCard from "./tweet";

export default function TweetLists({ tweets }: { tweets: Tweet[] }) {
  console.log(tweets);
  return (
    <div className="flex flex-col gap-8">
      {tweets.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
    </div>
  );
}
