// Old Skool DJ — reads your track list from Tracks.json
// Tracks.json lives in your GitHub repo, in the same folder as index.html.
// Create it on the Update Track Library page, then upload it to GitHub.

export const TRACKS_FILE = "Tracks.json";   // GitHub is case-sensitive: capital T

export async function loadTracks() {
  if (location.protocol === "file:") {
    throw new Error("Open the site from its GitHub Pages address. Browsers block Tracks.json when a page is opened straight from your computer.");
  }

  let res;
  try {
    // "no-cache" checks GitHub for a newer copy but re-uses the saved one if it hasn't changed
    res = await fetch(TRACKS_FILE, { cache: "no-cache" });
  } catch {
    throw new Error("Couldn't reach Tracks.json. Check your internet connection.");
  }

  if (res.status === 404) {
    throw new Error("Tracks.json wasn't found. Create it on the Update Track Library page and upload it to your GitHub repo, next to index.html.");
  }
  if (!res.ok) throw new Error(`Tracks.json couldn't load (error ${res.status}).`);

  const data = await res.json();
  const tracks = (Array.isArray(data) ? data : data.tracks || []).filter(t => t && t.track);
  return { tracks, updated: data.updated ? new Date(data.updated) : null };
}

// "updated 1 Nov 2026"
export function updatedText(date) {
  return date ? `updated ${date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}` : "";
}
