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

let cachedRecords: RawCSVRecord[] | null = null;

async function loadRecords(): Promise<RawCSVRecord[]> {
  if (cachedRecords) return cachedRecords;
  const csvPath = path.join(process.cwd(), 'data/external/obs_media_mammals_aves_only.csv');
  const fileContents = await fs.readFile(csvPath, 'utf8');
  cachedRecords = parse(fileContents, {
    columns: true,
    skip_empty_lines: true,
  }) as RawCSVRecord[];
  return cachedRecords;
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // Replace birdMode with three separate flags
    const birdsEnabled = searchParams.get('birdsEnabled') === 'true';
    const mammalsEnabled = searchParams.get('mammalsEnabled') === 'true';
    const reptilesEnabled = searchParams.get('reptilesEnabled') === 'true';
    // Get the random seed if provided
    const randomSeed = searchParams.get('random');

    // Use the flags directly without defaulting to mammals
    const useBirdsEnabled = birdsEnabled;
    const useMammalsEnabled = mammalsEnabled;
    const useReptilesEnabled = reptilesEnabled;

    // Make sure we have at least one animal type enabled
    if (!useBirdsEnabled && !useMammalsEnabled && !useReptilesEnabled) {
      return NextResponse.json(
        { error: 'No animal types selected' },
        { status: 400 }
      );
    }

    const allRecords = await loadRecords();

    // Filter records based on which animal classes are enabled
    let records = allRecords.filter(record => {
      if (record.classs === 'Aves' && useBirdsEnabled) return true;
      if (record.classs === 'Mammalia' && useMammalsEnabled) return true;
      if (record.classs === 'Reptilia' && useReptilesEnabled) return true;
      return false;
    });

    // For now, there's so much goddamn roadkill, that I'm going to filter out possums. Ridiculous.
    // It's not their fault, this world is an alien and lovecraftian horror for them.
    records = records.filter(record => record.genus !== 'Didelphis');

    // Build a permutation that actually changes daily.
    const unixDays = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const indices = Array.from({ length: records.length }, (_, i) => i);
    const permutation = seededShuffle(indices, unixDays);

    let randomRecord;
    if (randomSeed) {
      const seed = parseInt(randomSeed);
      const randomIndex = Math.abs(seed) % records.length;
      randomRecord = records[permutation[randomIndex]];
    } else {
      const unixMinutes = Math.floor(Date.now() / (1000 * 60));
      const permutationIndex = unixMinutes % records.length;
      randomRecord = records[permutation[permutationIndex]];
    }

    // Sometimes randomRecord is undefined.
    if (!randomRecord) {
      console.error('randomRecord is undefined');
      return NextResponse.json(
        { error: 'Failed to fetch question' },
        { status: 500 }
      );
    }
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