// src/lib/sanityClient.js
import { createClient } from "@sanity/client";

export const client = createClient({
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
    dataset: import.meta.env.VITE_SANITY_DATASET,
    apiVersion: "2025-01-01",
    useCdn: true,
    token: import.meta.env.VITE_SANITY_READ_TOKEN, // optional for private datasets
});
