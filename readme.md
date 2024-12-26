# Animo: geoguessr, but for animals.

## Specifications:
This app is a game in which photos from the iNaturalist API are displayed. 
At each level, the user must correctly guess the phylogenetic position (kingdom, phylum, class, order, family, genus, species) of the animal in the photo.
The user has a dropdown menu to select the phylogenetic.

Scoring is based on phylogenetic distance.

For instance, say the animal is the common house mouse, "Mus musculus".
First screen:
1.  photo,
2.  dropdown (kingdom: animalia/plantae/fungi/protista/archaea/bacteria)
3. hint button. this provides a description of each branch. (kingdom: {animalia: "animals consume organic material, breathe oxygen, have myocytes and are able to move, can reproduce sexually.", plantae: "...", })
4. submit button.

## Features: 

NO SIGN IN. 

## User flow: 
Each screen: animal photo, guessing area, and a hint button.

## Data accessed:

### Photo_phylogenetic_tree
Each row contains a link to a photo, and the entire phylogenetic tree.

### Description_tree_position
taxon level (e.g. kingdom, phylum, class, order, family, genus, species), description. Scraped from wikipedia.


## Technologies:
Webapp. Vercel hosted. Next.js, Tailwind, postgres, supabase.
