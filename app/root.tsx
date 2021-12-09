import {
  Form,
  Link,
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "remix";
import type { LinksFunction } from "remix";
import styles from "./tailwind.css";
import StyledLink from "./components/styledLink";
import { User } from ".prisma/client";
import { getUser } from "./utils/session.server";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

type LoaderData = {
  user: Omit<User, "passwordHash"> | null;
};

export let loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  return { user };
};

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

const Header = ({ user }: LoaderData) => {
  return (
    <header className="flex justify-between p-2 bg-gray-300">
      <h1 className="text-lg font-medium">Twitter Clone</h1>
      {user ? (
        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-700">Logged in as: {user.username}</span>
          <Form method="post" action="/logout">
            <button className="font-medium hover:text-gray-500" type="submit">
              Logout
            </button>
          </Form>
        </div>
      ) : (
        <StyledLink to="/login">Login</StyledLink>
      )}
    </header>
  );
};

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const data = useLoaderData<LoaderData>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-100">
        <Header user={data?.user} />
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return <div className="m-8">{children}</div>;
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Error!">
      <Layout>
        <div>
          <h1>There was an error</h1>
          <p>{error.message}</p>
        </div>
      </Layout>
    </Document>
  );
}
export function CatchBoundary() {
  let caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}
