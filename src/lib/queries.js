// src/lib/queries.js
import groq from "groq";
import { client } from "./sanityClient";

const BASE_POST = groq`{
  _id,
  title,
  slug,
  mainImage{
    asset->{
      _id,
      url
    }
  },
  author->{
    name
  },
  publishedAt
}`;

const byCategory = groq`
*[_type == "post" && categories[0]->title == $category]
| order(publishedAt desc)
${BASE_POST}
`;

export async function fetchDLM() {
  return client.fetch(byCategory, { category: "Dirt Late Models" });
}

export async function fetchDSC() {
  return client.fetch(byCategory, { category: "Dirt Sprint Cars" });
}

export async function fetchNASCAR() {
  return client.fetch(byCategory, { category: "NASCAR" });
}

export async function fetchPhotos() {
  return client.fetch(
    groq`*[_type == "post" && categories[0]->title == "Photos"]
    | order(publishedAt desc) {
      _id,
      title,
      slug,
      mainImage{
        asset->{
          _id,
          url
        }
      },
      author->{
        name
      },
      publishedAt
    }`
  );
}

export async function fetchOther() {
  return client.fetch(
    groq`*[_type == "post" && categories[0]->title == "Other"]
    | order(publishedAt desc) {
      _id,
      title,
      slug,
      mainImage{
        asset->{
          _id,
          url
        }
      },
      author->{
        name
      },
      publishedAt
    }`
  );
}

export async function fetchAll() {
  return client.fetch(groq`
    *[_type == "post"]
    | order(publishedAt desc)
    ${BASE_POST}
  `);
}

export async function fetchLatest() {
  return client.fetch(groq`
    *[_type == "post"] | order(publishedAt desc)[0]{
      _id,
      title,
      slug,
      mainImage{ asset->{ url } },
      author->{ name },
      publishedAt,
      "category": categories[0]->title
    }
  `);
}

export async function fetchPostBySlug(slug) {
  return client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      mainImage{ asset->{ url } },
      author->{ name },
      publishedAt,
      "category": categories[0]->title,
      body
    }`,
    { slug }
  );
}
