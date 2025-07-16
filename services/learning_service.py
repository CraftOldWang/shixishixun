from typing import List, Dict, Any
from utils.language_utils import (
    extract_vocabulary, 
    analyze_grammar, 
    get_language_level, 
    generate_language_exercises
)

class LanguageLearningService:
    def __init__(self):
        pass
    
    def analyze_conversation(self, messages: List[Dict]) -> Dict[str, Any]:
        """
        Analyze a conversation for language learning insights.
        
        Args:
            messages: List of message dictionaries with 'content' and 'is_user' keys
            
        Returns:
            Dictionary with language learning analysis
        """
        # Extract AI character messages only
        ai_messages = [msg["content"] for msg in messages if not msg["is_user"]]
        
        if not ai_messages:
            return {
                "vocabulary": [],
                "grammar_points": [],
                "language_level": "Unknown",
                "exercises": []
            }
        
        # Combine AI messages for analysis
        combined_text = " ".join(ai_messages)
        
        # Get language level
        level = get_language_level(combined_text)
        
        # Extract vocabulary
        vocabulary = extract_vocabulary(combined_text)
        
        # Analyze grammar
        grammar_points = analyze_grammar(combined_text)
        
        # Generate exercises
        exercises = generate_language_exercises(combined_text, level)
        
        return {
            "vocabulary": vocabulary,
            "grammar_points": grammar_points,
            "language_level": level,
            "exercises": exercises
        }
    
    def get_learning_progress(self, user_id: int, recent_conversations: List[Dict]) -> Dict[str, Any]:
        """
        Analyze user's learning progress based on recent conversations.
        
        Args:
            user_id: User ID
            recent_conversations: List of recent conversations
            
        Returns:
            Dictionary with learning progress metrics
        """
        # This is a simplified implementation
        # In a real application, you would track user's vocabulary acquisition,
        # grammar mastery, speaking fluency, etc.
        
        if not recent_conversations:
            return {
                "total_messages": 0,
                "vocabulary_exposure": 0,
                "grammar_points_encountered": 0,
                "estimated_level": "Unknown",
                "improvement_suggestions": [
                    "Start conversations to begin tracking your progress."
                ]
            }
        
        # Count total messages
        total_messages = sum(len(conv.get("messages", [])) for conv in recent_conversations)
        
        # Extract all AI messages for analysis
        all_ai_messages = []
        for conv in recent_conversations:
            for msg in conv.get("messages", []):
                if not msg.get("is_user", True):
                    all_ai_messages.append(msg.get("content", ""))
        
        combined_text = " ".join(all_ai_messages)
        
        # Get vocabulary exposure
        vocabulary = extract_vocabulary(combined_text)
        vocab_count = len(vocabulary)
        
        # Get grammar points encountered
        grammar_points = analyze_grammar(combined_text)
        grammar_count = len(grammar_points)
        
        # Estimate level
        estimated_level = get_language_level(combined_text)
        
        # Generate improvement suggestions
        suggestions = [
            "Practice regularly to improve vocabulary retention.",
            "Try conversations with different character personalities.",
            "Focus on using new vocabulary in your responses."
        ]
        
        return {
            "total_messages": total_messages,
            "vocabulary_exposure": vocab_count,
            "grammar_points_encountered": grammar_count,
            "estimated_level": estimated_level,
            "improvement_suggestions": suggestions
        }
    
    def generate_study_plan(self, user_level: str, target_level: str, 
                           interests: List[str], available_time_per_week: int) -> Dict[str, Any]:
        """
        Generate a personalized study plan for the user.
        
        Args:
            user_level: Current language level (A1-C2)
            target_level: Target language level
            interests: List of user interests
            available_time_per_week: Hours available per week
            
        Returns:
            Dictionary with study plan
        """
        # This is a simplified implementation
        # In a real application, this would be much more sophisticated
        
        levels = ["A1", "A2", "B1", "B2", "C1", "C2"]
        current_level_idx = next((i for i, level in enumerate(levels) if level in user_level), 0)
        target_level_idx = next((i for i, level in enumerate(levels) if level in target_level), 5)
        
        # Calculate estimated weeks to reach target
        level_difference = target_level_idx - current_level_idx
        if level_difference <= 0:
            weeks_estimate = 0
        else:
            # Rough estimate: 12 weeks per level with 10 hours/week
            base_weeks_per_level = 12
            base_hours_per_week = 10
            
            total_hours_needed = level_difference * base_weeks_per_level * base_hours_per_week
            weeks_estimate = total_hours_needed / available_time_per_week
        
        # Generate weekly goals
        weekly_goals = []
        if level_difference > 0:
            weekly_goals = [
                f"Have {available_time_per_week // 5} conversations with anime characters",
                "Learn 20 new vocabulary words",
                "Practice 3 new grammar patterns",
                "Complete 2 reading exercises",
                "Review conversation feedback"
            ]
        
        # Recommended characters based on level and interests
        recommended_characters = [
            {
                "name": "Friendly Beginner Guide",
                "description": "Perfect for beginners with simple language",
                "suitable_for": "A1-A2"
            },
            {
                "name": "Casual Conversation Partner",
                "description": "Natural everyday conversations",
                "suitable_for": "A2-B1"
            },
            {
                "name": "Academic Discussion Partner",
                "description": "More complex topics and vocabulary",
                "suitable_for": "B1-C1"
            }
        ]
        
        # Filter characters suitable for user level
        suitable_characters = [
            char for char in recommended_characters 
            if any(level in char["suitable_for"] for level in levels[current_level_idx:current_level_idx+2])
        ]
        
        return {
            "current_level": user_level,
            "target_level": target_level,
            "estimated_weeks_to_target": int(weeks_estimate),
            "weekly_goals": weekly_goals,
            "recommended_characters": suitable_characters,
            "recommended_session_length": "15-20 minutes",
            "recommended_frequency": f"{available_time_per_week // 3} sessions per week"
        } 