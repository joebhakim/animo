import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { parse } from 'csv-parse/sync';
import type { Taxon, GameQuestion } from '@/types/taxonomy';
import { getOptionsForRank } from '@/utils/taxonomyMaps';

interface RawCSVRecord {
  id: string;
  scientificName: string;
  taxonRank: string;
  kingdom: string;
  phylum: string;
  classs: string;  // note the three 's's
  order: string;
  family: string;
  genus: string;
  identifier: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hardMode = searchParams.get('hardMode') === 'true';

    const csvPath = path.join(process.cwd(), 'data/external/obs_media_mammals_aves_only.csv');
    const fileContents = await fs.readFile(csvPath, 'utf8');
    
    const allRecords = parse(fileContents, {
      columns: true,
      skip_empty_lines: true
    }) as RawCSVRecord[];

    // Filter records based on hard mode
    const records = hardMode 
      ? allRecords 
      : allRecords.filter(record => record.classs === 'Mammalia');

    // Get Unix timestamp in minutes and use it to select a record
    const unixMinutes = Math.floor(Date.now() / (1000 * 60));
    const randomIndex = unixMinutes % records.length;
    const randomRecord = records[randomIndex];

    const taxon: Taxon = {
      id: parseInt(randomRecord.id),
      scientificName: randomRecord.scientificName,
      kingdom: randomRecord.kingdom,
      phylum: randomRecord.phylum,
      class: randomRecord.classs,  // map 'classs' to 'class'
      order: randomRecord.order,
      family: randomRecord.family,
      genus: randomRecord.genus,
      species: randomRecord.scientificName  // use scientificName as species
    };

    const question: GameQuestion = {
      taxon,
      currentRank: 'kingdom',
      correctAnswer: taxon.kingdom,
      identifier: randomRecord.identifier,
      availableOptions: getOptionsForRank('kingdom', taxon.kingdom)
    };

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error loading question:', error);
    return NextResponse.json(
      { error: 'Failed to fetch question' },
      { status: 500 }
    );
  }
} 