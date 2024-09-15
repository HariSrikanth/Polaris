import torch
from transformers import BertTokenizer, BertForSequenceClassification

def classify_text(text):
    tokenizer = BertTokenizer.from_pretrained('./financial_phrasebank_model')
    model = BertForSequenceClassification.from_pretrained('./financial_phrasebank_model')

    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True, max_length=128)
    outputs = model(**inputs)
    predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
    predicted_label = predictions.argmax().item()

    label_map = {0: 'negative sentiment', 1: 'neutral sentiment', 2: 'positive sentiment'}
    return label_map[predicted_label]

text_input = input("Enter text for classification: ")
print(f"Predicted Sentiment: {classify_text(text_input)}")
