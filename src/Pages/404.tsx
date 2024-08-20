import { Spinner } from "@fluentui/react-components";
import { Helmet } from "react-helmet";
import { useRouter } from "~/Components/Router";
import { Dic } from "~/Helpers/Entities";

/**
 * @author Aloento
 * @since 0.1.0
 * @version 1.0.0
 */
export function NotFound() {
  const { Rep } = useRouter();
  setTimeout(() => Rep("/"), 3000);

  return <>
    <Helmet>
      <title>Redirect - Not Found - {Dic.Name}</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>

    <Spinner size="huge" label="404, Redirecting..." />
  </>;
}
