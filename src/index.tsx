import { Button, FluentProvider, webLightTheme } from "@fluentui/react-components";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "./Components/Router";
import "./index.css";

const container = document.querySelector("#root")!;
const root = createRoot(container);

root.render(
  <FluentProvider theme={webLightTheme}>
    <BrowserRouter>
      <div>
        <h1>Hello, world!</h1>

        <Button>Click me</Button>
      </div>
    </BrowserRouter>
  </FluentProvider>
);
