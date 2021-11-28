import {
  ActionFunction,
  Form,
  HeadersFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
  useActionData,
} from "remix";
import { z } from "zod";
import Alert from "~/components/alert";
import {
  createUserSession,
  getUser,
  login,
  register,
  userExists,
} from "~/utils/session.server";

export let meta: MetaFunction = () => {
  return {
    title: "Twitter Clone | Login",
    description: "Login to submit tweets!",
  };
};

export let headers: HeadersFunction = () => {
  return {
    "Cache-Control": `public, max-age=${60 * 10}, s-maxage=${
      60 * 60 * 24 * 30
    }`,
  };
};

const LoginFormSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(4),
  type: z.enum(["login", "register"]),
});

type LoginForm = z.infer<typeof LoginFormSchema>;

type ActionData = {
  form?: LoginForm;
  formErrors?: string[];
  fieldErrors?: { [key: string]: string[] };
};

export let action: ActionFunction = async ({
  request,
}): Promise<ActionData | Response> => {
  const form = Object.fromEntries(await request.formData()) as LoginForm;
  const parsedForm = LoginFormSchema.safeParse(form);

  if (!parsedForm.success) {
    return { form, ...parsedForm.error.flatten() };
  }

  switch (form.type) {
    case "login": {
      const user = await login(form);
      if (!user) {
        return {
          form,
          formErrors: ["Invalid username or password"],
        };
      }
      return createUserSession(user.id, "/");
    }
    case "register": {
      if (await userExists(form.username)) {
        return {
          form,
          formErrors: ["Username already exists"],
        };
      }

      const user = await register(form);
      if (!user) {
        return {
          form,
          formErrors: ["Failed to register"],
        };
      }

      return createUserSession(user.id, "/");
    }
    default: {
      return { form, formErrors: [`Login type invalid`] };
    }
  }
};

export let loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (user) return redirect("/");
  return null;
};

export default function Login() {
  const actionData = useActionData<any | undefined>();
  console.log(actionData);
  return (
    <div>
      <main className="w-full flex flex-col items-center gap-4">
        <h1 className="text-3xl font-medium">Login</h1>
        <Form method="post">
          <fieldset className="flex gap-4 mb-4">
            <label>
              <input
                type="radio"
                name="type"
                value="login"
                defaultChecked={
                  !actionData?.form?.type || actionData?.form?.type === "login"
                }
              />{" "}
              Login
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="register"
                defaultChecked={actionData?.form?.type === "register"}
              />{" "}
              Register
            </label>
          </fieldset>

          <label
            htmlFor="username-input"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username-input"
            name="username"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Your username"
            defaultValue={actionData?.form?.username}
          />

          {actionData?.fieldErrors?.username && (
            <p
              className="mt-2 text-sm text-red-600"
              role="alert"
              id="username-error"
            >
              {actionData.fieldErrors.username}
            </p>
          )}
          <label
            htmlFor="password-input"
            className="block text-sm font-medium text-gray-700 mt-4"
          >
            Password
          </label>
          <input
            type="password"
            id="password-input"
            name="password"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Your password"
            defaultValue={actionData?.form?.password}
          />
          {actionData?.fieldErrors?.password && (
            <p
              className="mt-2 text-sm text-red-600"
              role="alert"
              id="password-error"
            >
              {actionData.fieldErrors.password}
            </p>
          )}
          <button
            type="submit"
            className="my-4 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>

          <Alert errors={actionData?.formErrors} />
        </Form>
      </main>
    </div>
  );
}
