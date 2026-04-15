import type { SanityPost } from "../types";

export function fetchDLM(): Promise<SanityPost[]>;
export function fetchDSC(): Promise<SanityPost[]>;
export function fetchNASCAR(): Promise<SanityPost[]>;
export function fetchPhotos(): Promise<SanityPost[]>;
export function fetchOther(): Promise<SanityPost[]>;
export function fetchAll(): Promise<SanityPost[]>;
export function fetchLatest(): Promise<SanityPost | null>;
export function fetchPostBySlug(slug: string): Promise<SanityPost | null>;
