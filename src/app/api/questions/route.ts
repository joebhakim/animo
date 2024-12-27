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
  classs: string;  // note the three 's's, programming languages would hate two 's's
  order: string;
  family: string;
  genus: string;
  identifier: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const birdMode = searchParams.get('birdMode') === 'true';

    const csvPath = path.join(process.cwd(), 'data/external/obs_media_mammals_aves_only.csv');
    const fileContents = await fs.readFile(csvPath, 'utf8');

    const allRecords = parse(fileContents, {
      columns: true,
      skip_empty_lines: true
    }) as RawCSVRecord[];

    // Filter records to only show mammals unless bird mode is enabled
    let records = birdMode
      ? allRecords
      : allRecords.filter(record => record.classs === 'Mammalia');

    // For now, there's so much goddamn roadkill, that I'm going to filter out possums. Ridiculous.
    // It's not their fault, this world is an alien and lovecraftian horror for them.
    records = records.filter(record => record.genus !== 'Didelphis');



    // Generate a permutation that changes daily
    const unixDays = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const indices = Array.from({ length: records.length }, (_, i) => i);
    const permutation = indices.sort(() => Math.sin(unixDays + 1) - 0.5);

    // Get Unix timestamp in minutes and use it to select from the permutation
    const unixMinutes = Math.floor(Date.now() / (1000 * 60));
    const permutationIndex = unixMinutes % records.length;
    const randomRecord = records[permutation[permutationIndex]];

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