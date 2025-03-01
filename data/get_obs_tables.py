import pandas as pd

import json
from collections import defaultdict



def main():

    # Two data files: observations_top_n.csv and media_top_n.csv
    # formats: observations_top_n.csv:

    """
    id,occurrenceID,basisOfRecord,modified,institutionCode,collectionCode,datasetName,informationWithheld,catalogNumber,references,occurrenceRemarks,recordedBy,recordedByID,identifiedBy,identifiedByID,captive,eventDate,eventTime,verbatimEventDate,verbatimLocality,decimalLatitude,decimalLongitude,coordinateUncertaintyInMeters,geodeticDatum,countryCode,stateProvince,identificationID,dateIdentified,identificationRemarks,taxonID,scientificName,taxonRank,kingdom,phylum,class,order,family,genus,license,rightsHolder,inaturalistLogin,publishingCountry,sex,lifeStage,reproductiveCondition


    31930820,https://www.inaturalist.org/observations/31930820,HumanObservation,2019-10-04T15:12:03Z,iNaturalist,Observations,iNaturalist research-grade observations,,31930820,https://www.inaturalist.org/observations/31930820,,Paul Braun,https://orcid.org/0000-0002-3620-6188,Paul Braun,https://orcid.org/0000-0002-3620-6188,wild,2019-09-01T16:46:48+02:00,16:46:48+02:00,2019-09-01 4:46:48 pm CEST,"51512, Njivice, Croatia",45.1618614197,14.5384693146,,EPSG:4326,HR,Primorsko-Goranska,69199963,2019-09-01T18:03:55Z,"",55727,Cymbalaria muralis,species,Plantae,Tracheophyta,Magnoliopsida,Lamiales,Plantaginaceae,Cymbalaria,http://creativecommons.org/publicdomain/zero/1.0/,Paul Braun,paul_luap,LU,,,""

    """

    # media_top_n.csv:
    """
    id,type,format,identifier,references,created,creator,publisher,license,rightsHolder,catalogNumber
    31930820,StillImage,image/jpeg,https://inaturalist-open-data.s3.amazonaws.com/photos/50027543/original.jpeg,https://www.inaturalist.org/photos/50027543,2019-09-01T16:46:48-07:00,Paul Braun,iNaturalist,http://creativecommons.org/publicdomain/zero/1.0/,Paul Braun,50027543
    """

    # Read both
    obs = pd.read_csv("/home/joe/data_portico/observations_top_100000.csv")
    media = pd.read_csv("/home/joe/data_portico/media_top_100000.csv")

    # need only the following from obs: id, scientificName,taxonRank,kingdom,phylum,class,order,family,genus,
    # need only the following from media: id, identifier

    obs = obs[
        [
            "id",
            "scientificName",
            "taxonRank",
            "kingdom",
            "phylum",
            "class",
            "order",
            "family",
            "genus",
        ]
    ]
    media = media[["id", "identifier"]]

    # rename class to classs
    obs.rename(columns={"class": "classs"}, inplace=True)

    # merge on id
    obs_media = pd.merge(obs, media, on="id")

    # filter on "kingdom" == "Animalia"
    obs_media = obs_media[obs_media["kingdom"] == "Animalia"]

    # for now, filter on class = 'Mammalia' or 'Aves' or 'Reptilia'
    obs_media = obs_media[
        #(obs_media["classs"] == "Mammalia") | (obs_media["classs"] == "Aves") | (obs_media["classs"] == "Reptilia")
        obs_media["classs"].isin(["Reptilia"])
    ]

    print("number of records:", obs_media.shape[0])
    print(obs_media.head())

    # save to csv
    obs_media.to_csv("/home/joe/animo/data/external/obs_media_mammals_aves_only.csv", index=False)

    # Now, there's a limited subtree, of kingdom=Animalia, phylym=Chordata, class=Mammalia, order=..., family=..., genus=..., species=....
    
        # Seven levels, so six level pairs. For each pair, create a dict mapping the e.g. family name to the set of genus names in that family.

    kingdom_to_phylum = defaultdict(set)
    phylum_to_class = defaultdict(set)
    class_to_order = defaultdict(set)
    order_to_family = defaultdict(set)
    family_to_genus = defaultdict(set)
    genus_to_species = defaultdict(set)

    for i, row in obs_media.iterrows():
        # check if any are NaN or empty
        if any([pd.isna(row[col]) for col in obs_media.columns]):
            print("NaN value found")
            print(row)
            continue
        kingdom_to_phylum[row['kingdom']].add(row['phylum'])
        phylum_to_class[row['phylum']].add(row['classs'])
        class_to_order[row['classs']].add(row['order'])
        order_to_family[row['order']].add(row['family'])
        family_to_genus[row['family']].add(row['genus'])
        genus_to_species[row['genus']].add(row['scientificName'])

    

    # convert to dict
    kingdom_to_phylum = dict(kingdom_to_phylum)
    phylum_to_class = dict(phylum_to_class)
    class_to_order = dict(class_to_order)
    order_to_family = dict(order_to_family)
    family_to_genus = dict(family_to_genus)
    genus_to_species = dict(genus_to_species)

    # can't store sets in json, so convert to lists
    for k, v in kingdom_to_phylum.items():
        kingdom_to_phylum[k] = list(v)

    for k, v in phylum_to_class.items():
        phylum_to_class[k] = list(v)

    for k, v in class_to_order.items():
        class_to_order[k] = list(v)

    for k, v in order_to_family.items():
        order_to_family[k] = list(v)

    for k, v in family_to_genus.items():
        family_to_genus[k] = list(v)

    for k, v in genus_to_species.items():
        genus_to_species[k] = list(v)
        

    # store each of these separately
    with open("./external/kingdom_to_phylum.json", "w") as f:
        json.dump(kingdom_to_phylum, f)
    
    with open("./external/phylum_to_class.json", "w") as f:
        json.dump(phylum_to_class, f)

    with open("./external/class_to_order.json", "w") as f:
        json.dump(class_to_order, f)

    with open("./external/order_to_family.json", "w") as f:
        json.dump(order_to_family, f)

    with open("./external/family_to_genus.json", "w") as f:
        json.dump(family_to_genus, f)

    with open("./external/genus_to_species.json", "w") as f:
        json.dump(genus_to_species, f)

    print("Done")


if __name__ == "__main__":
    main()
