export interface TaxonomicRank {
  name: string;
  description: string;
}

export interface Taxon {
  id: number;
  scientificName: string;
  commonName?: string;
  kingdom: string;
  phylum: string;
  class: string;
  order: string;
  family: string;
  genus: string;
  species: string;
  description?: string;
}

export interface GameQuestion {
  currentRank: 'kingdom' | 'phylum' | 'class' | 'order' | 'family' | 'genus' | 'species';
  identifier: string;  // URL to the image
  correctAnswer: string;
  availableOptions: string[];
  taxon: Taxon;
}

export const KINGDOM_DESCRIPTIONS = {
  Animalia: "Animals consume organic material, breathe oxygen, and can move.",
  Plantae: "Plants are photosynthetic organisms with cellulose cell walls.",
  Fungi: "Fungi digest food externally and absorb nutrients.",
  Protista: "Protists are diverse eukaryotic organisms.",
  Bacteria: "Single-celled microorganisms without a nucleus.",
  Archaea: "Single-celled organisms similar to bacteria but with different cell chemistry."
} as const; 