import type { MetaFunction } from "remix";

export let meta: MetaFunction = () => {
  return {
    title: "Twitter Clone",
    description: "Simple Twitter Clone written with Remix",
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  return (
    <div>
      <main>Hello World</main>
    </div>
  );
}
