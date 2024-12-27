import { getWikiExtract } from './wikiApi';

export async function getHints(taxonNames: string[]): Promise<Record<string, string>> {
  const hints: Record<string, string> = {};
  
  // Fetch Wikipedia extracts for each taxon in parallel

  console.log('Getting hints for...', taxonNames);
  const numSentencesToFetch = 2;
  const hintPromises = taxonNames.map(async (taxonName) => {
    const extract = await getWikiExtract(taxonName, numSentencesToFetch);
    hints[taxonName] = extract.extract || `No information available for ${taxonName}`;
  });

  await Promise.all(hintPromises);
  return hints;
} 