/**
 * Fetches JSON data from a given URL.
 * Automatically handles path adjustment based on current page location.
 * @param {string} relativePath - The path relative to the site root (e.g., 'data/projects.json')
 * @returns {Promise<any>}
 */
export async function fetchData(relativePath) {
  // Determine the correct prefix based on whether we are in /pages/ or at the root
  const isInsidePages = window.location.pathname.includes('/pages/');
  const fullPath = isInsidePages ? `../${relativePath}` : relativePath;

  try {
    const response = await fetch(fullPath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Could not fetch data from ${fullPath}:`, error);
    throw error;
  }
}
