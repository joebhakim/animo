const WIKI_API_BASE = 'https://en.wikipedia.org/w/api.php';

export async function getWikiExtract(taxonName: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: 'query',
    prop: 'extracts',
    exintro: 'true',
    titles: taxonName,
    format: 'json',
    origin: '*',  // Required for CORS
    exsentences: '2'  // Limit to 2 sentences for concise hints
  });

  try {
    const response = await fetch(`${WIKI_API_BASE}?${params}`);
    const data = await response.json();
    
    // Extract the page content from the nested response
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    return pages[pageId].extract || null;
  } catch (error) {
    console.error('Error fetching Wikipedia extract:', error);
    return null;
  }
} 