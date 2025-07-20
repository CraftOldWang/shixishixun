from typing import List, Dict, Any
import re

def extract_vocabulary(text: str) -> List[Dict[str, str]]:
    """
    Extract potentially new vocabulary words from text.
    Returns a list of dictionaries with word and simple definition.
    """
    # This is a simplified implementation
    # In a real application, you might use NLP libraries to identify uncommon words
    words = re.findall(r'\b[a-zA-Z]{4,}\b', text)
    unique_words = list(set([word.lower() for word in words if len(word) > 3]))
    
    # Return the top 3-5 potentially new words
    result = []
    for word in unique_words[:5]:
        result.append({
            "word": word,
            "simple_definition": f"Definition would be fetched from a dictionary API"
        })
    
    return result

def analyze_grammar(text: str) -> List[Dict[str, Any]]:
    """
    Analyze text for grammar patterns and provide explanations.
    Returns a list of grammar points found in the text.
    """
    # This is a simplified implementation
    # In a real application, you would use more sophisticated NLP techniques
    grammar_patterns = [
        {
            "pattern": r"\b(have|has) been\b",
            "name": "Present Perfect Continuous",
            "explanation": "Used to describe actions that started in the past and continue to the present."
        },
        {
            "pattern": r"\bwill be\b",
            "name": "Future Simple",
            "explanation": "Used to express actions that will happen in the future."
        },
        {
            "pattern": r"\bif.*would\b",
            "name": "Conditional",
            "explanation": "Used to describe hypothetical situations and their results."
        }
    ]
    
    results = []
    for pattern in grammar_patterns:
        if re.search(pattern["pattern"], text, re.IGNORECASE):
            results.append({
                "grammar_point": pattern["name"],
                "explanation": pattern["explanation"],
                "example": "Example from text would be extracted here"
            })
    
    return results

def get_language_level(text: str) -> str:
    """
    Estimate the language level of a text (A1, A2, B1, B2, C1, C2).
    This is a simplified implementation.
    """
    # Count words, average sentence length, and vocabulary diversity
    words = text.split()
    word_count = len(words)
    sentences = re.split(r'[.!?]+', text)
    sentence_count = len([s for s in sentences if s.strip()])
    
    if sentence_count == 0:
        avg_sentence_length = 0
    else:
        avg_sentence_length = word_count / sentence_count
    
    unique_words = len(set([word.lower() for word in words]))
    lexical_diversity = unique_words / word_count if word_count > 0 else 0
    
    # Simple heuristic for language level
    if word_count < 5:
        return "Unknown"
    elif avg_sentence_length < 6 and lexical_diversity < 0.6:
        return "A1 - Beginner"
    elif avg_sentence_length < 10 and lexical_diversity < 0.65:
        return "A2 - Elementary"
    elif avg_sentence_length < 15 and lexical_diversity < 0.7:
        return "B1 - Intermediate"
    elif avg_sentence_length < 20 and lexical_diversity < 0.75:
        return "B2 - Upper Intermediate"
    elif lexical_diversity < 0.8:
        return "C1 - Advanced"
    else:
        return "C2 - Proficient"

def generate_language_exercises(text: str, level: str) -> List[Dict[str, Any]]:
    """
    Generate language exercises based on the provided text and level.
    """
    # This is a simplified implementation
    words = text.split()
    
    # Generate fill-in-the-blank exercise
    fill_in_blank = {
        "type": "fill_in_blank",
        "question": "Fill in the blank with the appropriate word:",
        "text": "",
        "answer": ""
    }
    
    if len(words) > 10:
        selected_word = words[len(words) // 2]
        fill_in_blank["text"] = " ".join(words[:len(words) // 2]) + " _____ " + " ".join(words[len(words) // 2 + 1:])
        fill_in_blank["answer"] = selected_word
    
    # Generate vocabulary matching exercise
    vocab_exercise = {
        "type": "vocabulary_matching",
        "instructions": "Match the words with their meanings:",
        "words": [],
        "definitions": []
    }
    
    # In a real application, you would use a dictionary API to get real definitions
    sample_words = list(set([word.lower() for word in words if len(word) > 3]))[:5]
    for word in sample_words:
        vocab_exercise["words"].append(word)
        vocab_exercise["definitions"].append(f"Definition for {word}")
    
    return [fill_in_blank, vocab_exercise] 