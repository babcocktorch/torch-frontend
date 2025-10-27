import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { CREDENTIALS } from "./constants";

const projectId = CREDENTIALS.sanity_project_id;
const dataset = CREDENTIALS.sanity_dataset;
const apiVersion = "2024-10-21";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export const urlFor = (source: any) => builder.image(source);
