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
        "content/things-popup.ts",
        "content/time-counter.ts",
        "content/page.ts",
        "content/mouse.ts",
        "content/feature-flags.ts",
        "content/words.ts",
        // "content/requests.js",
        "content.ts",
      ],
      type: "module",
      run_at: "document_idle",
    },
  ],
  permissions: ["activeTab", "webRequest", "storage"],
  host_permissions: ["<all_urls>"],
  background: {
    service_worker: "/src/background.js",
  },
}));
