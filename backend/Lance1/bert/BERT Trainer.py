import pandas as pd
from tqdm import tqdm
from transformers import pipeline

file_path = "/Users/harisrikanth/Documents/Work/Cal/Comps/HackMIT/Polaris/Data/FinancialPhraseBank-v1.0/Sentences_50Agree.txt"

fraction = 0.1
df = pd.read_csv(file_path, sep='\t', names=['Sentence', 'Sentiment'], encoding='latin1', nrows=10000)

df_sampled = df.sample(frac=fraction, random_state=42)

hypothesis_template = "This example is about {}"
classes_verbalized = ["positive sentiment", "negative sentiment", "neutral sentiment"]

zeroshot_classifier = pipeline("zero-shot-classification", 
                               model="MoritzLaurer/deberta-v3-large-zeroshot-v1.1-all-33")

results = []

for index, row in tqdm(df_sampled.iterrows(), total=df_sampled.shape[0], desc="Classifying Sentences"):
    text = row['Sentence']
    true_label = row['Sentiment']
    
    output = zeroshot_classifier(text, classes_verbalized, hypothesis_template=hypothesis_template, multi_label=False)
    
    predicted_label = output['labels'][0]
    
    results.append({
        'Sentence': text,
        'True Sentiment': true_label,
        'Predicted Sentiment': predicted_label,
        'Model Confidence': output['scores'][0]
    })

results_df = pd.DataFrame(results)

print(results_df.head())

results_df.to_csv("financial_phrasebank_results_sampled.csv", index=False)
