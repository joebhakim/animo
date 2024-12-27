const WIKI_API_BASE = 'https://en.wikipedia.org/w/api.php';

// e.g.
// https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&titles=Albert%20Einstein

export async function getWikiExtract(taxonName: string, numSentencesToFetch: number): Promise<{ extract: string; pageTitle: string | null }> {
  const params = new URLSearchParams({
    action: 'query',
    prop: 'extracts',
    exintro: 'true',
    titles: taxonName,
    format: 'json',
    origin: '*',
    exsentences: numSentencesToFetch.toString(),
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
      return { extract: `No information available for ${taxonName}`, pageTitle: null };
    }

    const extract = pages[pageId].extract;
    const pageTitle = pages[pageId].title;
    
    if (!extract) {
      console.log(`No extract found for: ${taxonName}`);
      return { extract: `No description available for ${taxonName}`, pageTitle: null };
    }

    return { extract, pageTitle };
  } catch (error) {
    console.error('Error fetching Wikipedia extract:', error);
    return { extract: `Failed to fetch information for ${taxonName}`, pageTitle: null };
  }
}

export async function getWikiHeaderImage(pageTitle: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: 'query',
    prop: 'pageimages',
    format: 'json',
    piprop: 'original',
    titles: pageTitle,
    origin: '*'
  });

  try {
    const response = await fetch(`${WIKI_API_BASE}?${params}`);
    const data = await response.json();
    
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    
    if (pageId === '-1' || !pages[pageId].original) {
      console.log(`No header image found for: ${pageTitle}`);
      return null;
    }

    return pages[pageId].original.source;
  } catch (error) {
    console.error('Error fetching Wikipedia header image:', error);
    return null;
  }
} 