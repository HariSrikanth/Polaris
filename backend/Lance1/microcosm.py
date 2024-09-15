import json
import random

def extract_subset(input_file, output_file, subset_percentage=0.10):
    # Load the JSON data from the file
    with open(input_file, 'r', encoding='utf-8') as infile:
        data = [json.loads(line) for line in infile]

    # Calculate the number of items to extract
    subset_size = int(len(data) * subset_percentage)

    # Shuffle the data and extract the subset
    random.shuffle(data)
    subset = data[:subset_size]

    # Save the subset to a new JSON file
    with open(output_file, 'w', encoding='utf-8') as outfile:
        for record in subset:
            outfile.write(json.dumps(record) + '\n')

    print(f"Subset extraction completed. {subset_size} records saved to {output_file}.")


def format_json_lines(input_path, output_path):
    with open(input_path, 'r', encoding='utf-8') as infile, open(output_path, 'w', encoding='utf-8') as outfile:
        for line in infile:
            try:
                # Load the JSON object
                json_obj = json.loads(line.strip())
                
                # Convert JSON object back to string
                json_str = json.dumps(json_obj, ensure_ascii=False)
                
                # Write to output file
                outfile.write(json_str + '\n')
                
            except json.JSONDecodeError as e:
                print(f"Error decoding JSON: {e}")
            except Exception as e:
                print(f"An unexpected error occurred: {e}")

print("Conversion to JSON Lines format completed.")


# Example usage
input_file = '/Users/harisrikanth/Documents/Work/Cal/Comps/HackMIT/Polaris/Data/updated_final2.json'
output_file = '/Users/harisrikanth/Documents/Work/Cal/Comps/HackMIT/Polaris/Data/final_ic-fspml.json'


# Call the function
format_json_lines(input_file, output_file)
extract_subset(input_file, output_file)

