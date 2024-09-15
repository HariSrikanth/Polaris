import pandas as pd
import json

input_file = '/Users/harisrikanth/Documents/Work/Cal/Comps/HackMIT/Polaris/Data/ic-fspml stock news sentiment dataset/train-00000-of-00001-161ce92db66dabb3.parquet'
output_file = '/Users/harisrikanth/Documents/Work/Cal/Comps/HackMIT/Polaris/Data/ic-fspml.jsonl'

# Convert Parquet to DataFrame
df = pd.read_parquet(input_file)

# Convert Timestamp columns to string
for col in df.select_dtypes(include=['datetime64']).columns:
    df[col] = df[col].astype(str)

# Write DataFrame to JSON Lines (JSONL) file
with open(output_file, 'w', encoding='utf-8') as outfile:
    for record in df.to_dict(orient='records'):
        outfile.write(json.dumps(record) + '\n')

print("Conversion to JSONL completed.")

import json

input_file = '/Users/harisrikanth/Documents/Work/Cal/Comps/HackMIT/Polaris/Data/ic-fspml.jsonl'

with open(input_file, 'r', encoding='utf-8') as infile:
    for line in infile:
        try:
            json.loads(line)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON line: {e}")
            print(f"Faulty line: {line}")
            break

input_file = '/Users/harisrikanth/Documents/Work/Cal/Comps/HackMIT/Polaris/Data/ic-fspml.jsonl'
temp_file = '/Users/harisrikanth/Documents/Work/Cal/Comps/HackMIT/Polaris/Data/ic-fspml-utf8.jsonl'

with open(input_file, 'r', encoding='utf-8', errors='replace') as infile:
    with open(temp_file, 'w', encoding='utf-8') as outfile:
        for line in infile:
            outfile.write(line)

print("Re-encoding completed.")

