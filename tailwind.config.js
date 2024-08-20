import { Config } from "tailwindcss";

/** @type {Config} */
const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  // plugins: [scopedPreflightStyles({
  //   isolationStrategy: isolateOutsideOfContainer([
  //     '[class^="fluent-"]',
  //   ])
  // })],
};

export default config;
