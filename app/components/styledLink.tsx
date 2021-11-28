import { RemixLinkProps } from "@remix-run/react/components";
import { Link } from "remix";

const StyledLink = (
  props: RemixLinkProps & React.RefAttributes<HTMLAnchorElement>
) => {
  return <Link className="hover:text-gray-500 font-medium" {...props} />;
};

export default StyledLink;
