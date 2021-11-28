import { Tweet, User } from "@prisma/client";
import { useLoaderData } from "remix";

export default function TweetCard({
  tweet,
}: {
  tweet: Tweet & { user?: User };
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between mb-3 ">
        <div className="text-sm text-gray-700">
          Created by{" "}
          <span className="text-green-800">
            {tweet.user?.username || "server"}
          </span>
        </div>
      </div>

      <div>{tweet.text}</div>
    </div>
  );
}
