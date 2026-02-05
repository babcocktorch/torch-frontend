import { CREDENTIALS } from "@/lib/constants";
import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: CREDENTIALS.sanity_project_id,
    dataset: CREDENTIALS.sanity_dataset,
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
    appId: "hy26z3f4aj5miqd2u8i1yw9v",
  },
});
