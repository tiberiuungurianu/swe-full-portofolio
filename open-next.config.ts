import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Incremental cache can be wired to R2 later. Deploy works without it.
export default defineCloudflareConfig({});
