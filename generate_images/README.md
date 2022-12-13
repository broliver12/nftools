## generate_images

Originally derived from hashlips' [art engine](https://github.com/HashLips/hashlips_art_engine).

Adapted to be specifically `ethereum` + `opensea` compatible. Rarity must be specified per trait.

## Usage

1. Add correctly names trait files to `/config/traits`

2. Add names or layers, traits, and rarities to `/config/layer_config.js`

3. Add custom renaming logic, layer exclusion logic, and empty file logic in `/config/logic_config.js`

4. Execute `node generate_images <amt>` where `<amt>` is the collection size.

## Output

- `/output/images` contains collection images, names `0.png` - `amt.png`
- `/output/metadata` contains collection metadata, names `0.json` - `amt.json`
- `/output/report/idMap.json` contains the map of `tokenIds` (which are `0,1...amt`) to `collectible id` which is typically a random number between `1` and `amt`
- `/output/report/traitOccurence.json` has a list of how many times each trait is used
- `/output/report/traitPercents.json` has a list of the percentage usages of each trait

## Coming soon: 
- Rarity verification
- Trait name verification
- Metadata only
- Metadata from partial hash
- Art from Metadata