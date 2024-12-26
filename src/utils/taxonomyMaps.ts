import genusToSpecies from '~/data/external/genus_to_species.json';
import familyToGenus from '../../data/external/family_to_genus.json';
import orderToFamily from '../../data/external/order_to_family.json';
import classToOrder from '../../data/external/class_to_order.json';
import phylumToClass from '../../data/external/phylum_to_class.json';
import kingdomToPhylum from '../../data/external/kingdom_to_phylum.json';

export const taxonomicMaps = {
  genusToSpecies,
  familyToGenus,
  orderToFamily,
  classToOrder,
  phylumToClass,
  kingdomToPhylum,
} as const;

const kingdoms_hardcoded = ['Animalia', 'Plantae', 'Fungi', 'Protista', 'Bacteria', 'Archaea']

export function getOptionsForRank(rank: string, parent?: string): string[] {

  if (!parent) return kingdoms_hardcoded;
  
  switch (rank) {
    case 'species':
      return taxonomicMaps.genusToSpecies[parent] || [];
    case 'genus':
      return taxonomicMaps.familyToGenus[parent] || [];
    case 'family':
      return taxonomicMaps.orderToFamily[parent] || [];
    case 'order':
      return taxonomicMaps.classToOrder[parent] || [];
    case 'class':
      return taxonomicMaps.phylumToClass[parent] || [];
    case 'phylum':
      return taxonomicMaps.kingdomToPhylum[parent] || [];
    default:
      return kingdoms_hardcoded;
  }
} 