import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { parse } from 'csv-parse/sync';

interface RawCSVRecord {
  id: string;
  scientificName: string;
  taxonRank: string;
  kingdom: string;
  phylum: string;
  classs: string;
  order: string;
  family: string;
  genus: string;
  identifier: string;
}

// In-memory cache for species data
let cachedSpeciesData: {
  timestamp: number;
  allRecords: RawCSVRecord[];
} | null = null;

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

async function getSpeciesData() {
  // Check if we have a valid cache
  const now = Date.now();
  if (cachedSpeciesData && now - cachedSpeciesData.timestamp < CACHE_DURATION) {
    return cachedSpeciesData.allRecords;
  }

  // Cache miss or expired, load from file
  const csvPath = path.join(process.cwd(), 'data/external/obs_media_mammals_aves_only.csv');
  const fileContents = await fs.readFile(csvPath, 'utf8');

  const allRecords = parse(fileContents, {
    columns: true,
    skip_empty_lines: true
  }) as RawCSVRecord[];

  // Update cache
  cachedSpeciesData = {
    timestamp: now,
    allRecords
  };

  return allRecords;
}

export async function GET(request: Request) {

  console.log('GET request received');
  try {
    // Get query parameter
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.toLowerCase() || '';
    //const birdMode = searchParams.get('birdMode') === 'true';

    console.log('query delivered to typing suggestions', query);
    
    // Return early if query is too short
    if (query.length < 3) {
      return NextResponse.json([]);
    }

    // Get data from cache or file
    const allRecords = await getSpeciesData();

    // Filter records based on bird mode same as in questions route
    const records = allRecords

    // Filter out possums as in the questions route 
    //No need to filter these out since we're in the suggestions route
    //records = records.filter(record => record.genus !== 'Didelphis');

    // Find matching species based on the query
    const matchingSpecies = records
      .filter(record => {
        // Check for matches in scientific name
        const scientificNameMatch = record.scientificName.toLowerCase().includes(query);
        
        // Check for matches in genus (first part of scientific name)
        const genus = record.genus.toLowerCase();
        const genusMatch = genus.includes(query);
        
        // Or check for matches in any part of the taxonomy
        const anyTaxonomyMatch = 
          record.kingdom.toLowerCase().includes(query) ||
          record.phylum.toLowerCase().includes(query) ||
          record.classs.toLowerCase().includes(query) ||
          record.order.toLowerCase().includes(query) ||
          record.family.toLowerCase().includes(query);
        
        return scientificNameMatch || genusMatch || anyTaxonomyMatch;
      })
      .map(record => record.scientificName);

    // Remove duplicates and limit to 10 results

    // Just placeholder for now
    //const uniqueMatches = ['Aardvark', 'Aardvark', 'Aardvark', 'Aardvark', 'Aardvark', 'Aardvark', 'Aardvark', 'Aardvark', 'Aardvark', 'Aardvark'];
    
    const uniqueMatches = [...new Set(matchingSpecies)].slice(0, 100);

    

    // Add cache-control headers for browser caching
    const headers = new Headers();
    headers.append('Cache-Control', 'public, max-age=60'); // Cache for 1 minute in the browser

    // Return the unique matches, as { suggestions: uniqueMatches }
    return NextResponse.json({ suggestions: uniqueMatches }, { headers });
  } catch (error) {
    console.error('Error generating typing suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
} 