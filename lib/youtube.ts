/**
 * Extract the 11-char video ID from any common YouTube URL format.
 */
export function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

/**
 * Build a high-quality thumbnail URL from a YouTube URL.
 */
export function getYouTubeThumbnail(
  url: string,
  quality:
    | "default"
    | "mqdefault"
    | "hqdefault"
    | "sddefault"
    | "maxresdefault" = "hqdefault",
): string {
  const id = extractYouTubeId(url);
  return id
    ? `https://i.ytimg.com/vi/${id}/${quality}.jpg`
    : "/placeholder.jpg";
}

/**
 * Build an embeddable YouTube URL with autoplay.
 */
export function getYouTubeEmbedUrl(url: string): string {
  const id = extractYouTubeId(url);
  return id
    ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`
    : "";
}
