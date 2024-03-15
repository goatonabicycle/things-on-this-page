import { defineManifest } from "@crxjs/vite-plugin";

export const manifest = defineManifest(async () => ({
  manifest_version: 3,
  name: "Things On This Page",
  description: "",
  version: "0.1",
  content_scripts: [
    {
      matches: [
        "http://*/*",
        "https://*/*",
        "http://localhost/*",
        "file:///*/*",
      ],
      js: [
        "content/things-popup.js",
        "content/time-counter.ts",
        "content/page.js",
        "content/mouse.js",
        "content/words.ts",
        // "content/requests.js",
        "content.ts",
      ],
      type: "module",
      run_at: "document_idle",
    },
  ],
  permissions: [],
  host_permissions: ["<all_urls>"],
}));
