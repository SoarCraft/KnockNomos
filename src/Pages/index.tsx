import { Spinner } from "@fluentui/react-components";
import { useMemo } from "react";
import { PageFooter } from "~/Components/Layout/PageFooter";
import { TopNavBar } from "~/Components/Layout/TopNavBar";
import { useRouter } from "~/Components/Router";
import { NotFound } from "./404";
import { Home } from "./Home";

/**
 * @author Aloento
 * @since 0.1.0
 * @version 0.1.0
 */
export function Layout() {
  const { Paths } = useRouter();
  const path = Paths.at(0);

  const match = useMemo(() => {
    switch (path) {
      case "Login":
        return <Spinner size="huge" label="Login Redirecting..." />;

      case "Reload":
        return <Spinner size="huge" label="Reloading..." />;

      case "":
      case undefined:
        return <Home />;

      default:
        return <NotFound />;
    }
  }, [path]);

  return (
    <div className="absolute flex min-h-full w-full min-w-96 flex-col bg-zinc-50">
      <TopNavBar />

      <main className="mx-auto flex w-full max-w-screen-xl flex-col gap-y-8 px-3 pt-8">
        {match}
      </main>

      <PageFooter />
    </div>
  );
}
