import { MetaFunction } from "remix";

export let meta: MetaFunction = () => {
  return {
    title: "Twitter Clone",
    description: "Simple Twitter Clone written with Remix",
  };
};

export default function Index() {
  return (
    <div className="bg-green-500">
      <main>Hello World</main>
    </div>
  );
}
