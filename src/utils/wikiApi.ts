const WIKI_API_BASE = 'https://en.wikipedia.org/w/api.php';

// e.g.
// https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&titles=Albert%20Einstein

export async function getWikiExtract(taxonName: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: 'query',
    prop: 'extracts',
    exintro: 'true',
    titles: taxonName,
    format: 'json',
    origin: '*',
    exsentences: '2',
    explaintext: 'true',
    redirects: '1',
    converttitles: '1'
  });

  try {
    console.log(`Fetching Wikipedia extract for: ${taxonName}`);
    const response = await fetch(`${WIKI_API_BASE}?${params}`);
    const data = await response.json();
    
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    
    // Check if page exists (pageId -1 means "not found")
    if (pageId === '-1') {
      console.log(`No Wikipedia page found for: ${taxonName}`);
      return `No information available for ${taxonName}`;
    }

    const extract = pages[pageId].extract;
    if (!extract) {
      console.log(`No extract found for: ${taxonName}`);
      return `No description available for ${taxonName}`;
    }

    return extract;
  } catch (error) {
    console.error('Error fetching Wikipedia extract:', error);
    return `Failed to fetch information for ${taxonName}`;
  }
} 