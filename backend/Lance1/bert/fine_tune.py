import pandas as pd
import torch
from transformers import BertTokenizer, BertForSequenceClassification, Trainer, TrainingArguments, default_data_collator
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from datasets import Dataset
from tqdm import tqdm

file_path = "/Users/harisrikanth/Documents/Work/Cal/Comps/HackMIT/Polaris/Data/FinancialPhraseBank-v1.0/Sentences_50Agree.txt"
df = pd.read_csv(file_path, sep='\t', names=['Sentence', 'Sentiment'], encoding='latin1')

label_encoder = LabelEncoder()
df['Sentiment'] = label_encoder.fit_transform(df['Sentiment'])

train_texts, val_texts, train_labels, val_labels = train_test_split(df['Sentence'], df['Sentiment'], test_size=0.1)

train_dataset = Dataset.from_dict({'text': train_texts, 'label': train_labels})
val_dataset = Dataset.from_dict({'text': val_texts, 'label': val_labels})

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=len(df['Sentiment'].unique()))

def tokenize_function(examples):
    return tokenizer(examples['text'], padding='max_length', truncation=True, max_length=128)

train_dataset = train_dataset.map(tokenize_function, batched=True)
val_dataset = val_dataset.map(tokenize_function, batched=True)

data_collator = default_data_collator

training_args = TrainingArguments(
    output_dir='./results',
    evaluation_strategy="epoch",
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=3,
    weight_decay=0.01,
    logging_dir='./logs',
    logging_steps=10,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    data_collator=data_collator,
)

trainer.train()

model.save_pretrained('./financial_phrasebank_model')
tokenizer.save_pretrained('./financial_phrasebank_model')
