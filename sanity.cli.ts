import { CREDENTIALS } from "@/lib/constants";
import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: CREDENTIALS.sanity_project_id,
    dataset: CREDENTIALS.sanity_dataset,
  },
});
