import genusToSpecies from '~/data/external/genus_to_species.json' assert { type: 'json' };
import familyToGenus from '../../data/external/family_to_genus.json';
import orderToFamily from '../../data/external/order_to_family.json';
import classToOrder from '../../data/external/class_to_order.json';
import phylumToClass from '../../data/external/phylum_to_class.json';
import kingdomToPhylum from '../../data/external/kingdom_to_phylum.json';

type TaxonMap = Record<string, string[]>;

export const taxonomicMaps = {
  genusToSpecies: genusToSpecies as TaxonMap,
  familyToGenus: familyToGenus as TaxonMap,
  orderToFamily: orderToFamily as TaxonMap,
  classToOrder: classToOrder as TaxonMap,
  phylumToClass: phylumToClass as TaxonMap,
  kingdomToPhylum: kingdomToPhylum as TaxonMap,
} as const;

const kingdoms_hardcoded = ['Animalia', 'Plantae', 'Fungi', 'Protista', 'Bacteria', 'Archaea']

export function getRandomOptions(allOptions: string[], correctAnswer: string, count: number): string[] {
  // Ensure correctAnswer is included
  const otherOptions = allOptions.filter(opt => opt !== correctAnswer);

  //Throw an error if the correctAnswer was not in allOptions, since this is dependent on me doing the data correctly.
  if (!allOptions.includes(correctAnswer)) {
    throw new Error(`Correct answer "${correctAnswer}" not found in options`);
  }
  // Shuffle other options and take count-1 of them
  const randomOthers = otherOptions
    .sort(() => Math.random() - 0.5)
    .slice(0, count - 1);
  // Combine with correct answer and shuffle again
  return [...randomOthers, correctAnswer].sort(() => Math.random() - 0.5);
}

export function getOptionsForRank(
  rank: string,
  parent?: string,
  expertMode: boolean = true,
  correctAnswer?: string
): string[] {
  let allOptions: string[];

  if (!parent) {
    allOptions = kingdoms_hardcoded;
  } else {
    switch (rank) {
      case 'species':
        allOptions = taxonomicMaps.genusToSpecies[parent] || [];
        break;
      case 'genus':
        allOptions = taxonomicMaps.familyToGenus[parent] || [];
        break;
      case 'family':
        allOptions = taxonomicMaps.orderToFamily[parent] || [];
        break;
      case 'order':
        allOptions = taxonomicMaps.classToOrder[parent] || [];
        break;
      case 'class':
        allOptions = taxonomicMaps.phylumToClass[parent] || [];
        break;
      case 'phylum':
        allOptions = taxonomicMaps.kingdomToPhylum[parent] || [];
        break;
      case 'kingdom':
        allOptions = kingdoms_hardcoded;
        break;
      default:
        console.error(`Invalid rank provided: ${rank}`);
        throw new Error(`Invalid rank provided: ${rank}`);
    }
  }

  // If expert mode is off and we have a correct answer, limit to 6 random options
  if (!expertMode && correctAnswer && allOptions.length > 6) {
    return getRandomOptions(allOptions, correctAnswer, 6);
  }

  return allOptions;
} 