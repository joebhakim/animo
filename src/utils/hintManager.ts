import { getWikiExtract } from './wikiApi';

export async function getHints(taxonNames: string[]): Promise<Record<string, string>> {
  const hints: Record<string, string> = {};
  
  // Fetch Wikipedia extracts for each taxon in parallel

  console.log('Getting hints for...', taxonNames);
  const hintPromises = taxonNames.map(async (taxonName) => {
    const extract = await getWikiExtract(taxonName);
    hints[taxonName] = extract || `No information available for ${taxonName}`;
  });

  await Promise.all(hintPromises);
  return hints;
} 