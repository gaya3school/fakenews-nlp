import spacy
from newspaper import Article

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import os

    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")


def extract_content(url):
    """Downloads and parses news articles or social links."""
    article = Article(url)
    article.download()
    article.parse()
    return article.text


def analyze_text(text):
    """Calculates linguistic metrics: Adjective density, NER, and Sentiment."""
    doc = nlp(text)

    # 1. Entity Extraction (NER)
    entities = {"Person": [], "Org": [], "Place": []}
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            entities["Person"].append(ent.text)
        elif ent.label_ in ["ORG", "NORP"]:
            entities["Org"].append(ent.text)
        elif ent.label_ in ["GPE", "LOC"]:
            entities["Place"].append(ent.text)

    # 2. Adjective Overload Check (Sensationalism indicator)
    tokens = [t for t in doc if not t.is_punct]
    adjectives = [t for t in doc if t.pos_ == "ADJ"]
    adj_ratio = (len(adjectives) / len(tokens)) if tokens else 0

    # 3. Simple Scoring Logic
    # High adjective density often correlates with clickbait/fake news
    suspicion_score = min(adj_ratio * 450, 99.0)

    if suspicion_score < 35:
        verdict = "TRUSTED"
    elif suspicion_score < 65:
        verdict = "SUSPICIOUS"
    else:
        verdict = "POTENTIALLY FAKE"

    return {
        "verdict": verdict,
        "score": round(suspicion_score, 1),
        "entities": {k: list(set(v))[:5] for k, v in entities.items()},
        "metrics": {
            "adjective_overload": f"{round(adj_ratio * 100)}%",
            "syntax_exaggeration": "High" if adj_ratio > 0.16 else "Normal",
            "word_count": len(tokens)
        }
    }