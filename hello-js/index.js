import init, { hello } from "./pkg/hello_js.js";

await init();

hello("We Create!", "JavaScript in the browser");
