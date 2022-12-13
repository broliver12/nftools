## format_address_list

Takes an input CSV of Ethereum addresses, ensures their validity, removes any duplciate or invalid addresses and outputs a cleaned list, in addition to a report on any corrections made.

Use this tool to easily reformat the addresses collected from your discord to the expected etherscan function argument format

## Usage

1. Save collected addresses in an Excel sheet.
2. Export the sheet as .csv
3. Copy the contents of .csv (Starting with the first address, no header column) into `input.csv`
4. Execute `node format_address_list`

## Output

- Cleaned address list will be saved to `output.csv`
- Program report will be printed to terminal, as well as saved to `report.json`