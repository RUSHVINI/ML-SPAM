import re
URGENT = ["urgent","immediately","now","act now","limited time","free","winner","won","claim","verify","suspended","password","click here","offer","cash","prize","congratulations","expires","final notice","bonus"]
def extract_features(text: str) -> dict:
    t = str(text)
    low = t.lower()
    return {
        "word_count": len(t.split()),
        "link_count": len(re.findall(r"https?://|www\.", low)),
        "urgency_words": sum(len(re.findall(r"\b" + re.escape(w) + r"\b", low)) for w in URGENT),
        "capital_letters": sum(1 for c in t if c.isupper()),
    }
