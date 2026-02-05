import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { CREDENTIALS } from "@/lib/constants";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "default",
  title: "The Babcock Torch",

  projectId: CREDENTIALS.sanity_project_id,
  dataset: CREDENTIALS.sanity_dataset,

  basePath: "/studio",

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
