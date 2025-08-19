#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append('/Users/sheharzad/English-Learning-App/backend')

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from learning.models import Category, SkillLevel, Lesson

def create_sample_data():
    print("Creating sample data...")
    
    # Create Categories
    categories = [
        {'name': 'Grammar', 'description': 'Learn English grammar rules and structures', 'icon': 'grammar', 'order_index': 1},
        {'name': 'Vocabulary', 'description': 'Expand your English vocabulary', 'icon': 'vocabulary', 'order_index': 2},
        {'name': 'Speaking', 'description': 'Practice English speaking and pronunciation', 'icon': 'speaking', 'order_index': 3},
        {'name': 'Listening', 'description': 'Improve your English listening skills', 'icon': 'listening', 'order_index': 4},
        {'name': 'Reading', 'description': 'Enhance your English reading comprehension', 'icon': 'reading', 'order_index': 5},
        {'name': 'Writing', 'description': 'Develop your English writing skills', 'icon': 'writing', 'order_index': 6},
    ]
    
    for cat_data in categories:
        category, created = Category.objects.get_or_create(
            name=cat_data['name'],
            defaults=cat_data
        )
        if created:
            print(f"Created category: {category.name}")
        else:
            print(f"Category already exists: {category.name}")
    
    # Create Skill Levels
    skill_levels = [
        {'name': 'Beginner', 'order_index': 1, 'description': 'Basic English skills', 'min_points': 0},
        {'name': 'Elementary', 'order_index': 2, 'description': 'Elementary English skills', 'min_points': 100},
        {'name': 'Intermediate', 'order_index': 3, 'description': 'Intermediate English skills', 'min_points': 300},
        {'name': 'Upper-Intermediate', 'order_index': 4, 'description': 'Upper-intermediate English skills', 'min_points': 600},
        {'name': 'Advanced', 'order_index': 5, 'description': 'Advanced English skills', 'min_points': 1000},
    ]
    
    for level_data in skill_levels:
        skill_level, created = SkillLevel.objects.get_or_create(
            name=level_data['name'],
            defaults=level_data
        )
        if created:
            print(f"Created skill level: {skill_level.name}")
        else:
            print(f"Skill level already exists: {skill_level.name}")
    
    # Create Sample Lessons
    grammar_category = Category.objects.get(name='Grammar')
    vocabulary_category = Category.objects.get(name='Vocabulary')
    beginner_level = SkillLevel.objects.get(name='Beginner')
    elementary_level = SkillLevel.objects.get(name='Elementary')
    
    lessons = [
        {
            'title': 'Present Simple Tense',
            'description': 'Learn the basics of present simple tense',
            'category': grammar_category,
            'skill_level': beginner_level,
            'content': {
                'text': 'The present simple tense is used to describe habits, general truths, and repeated actions.',
                'examples': ['I work every day.', 'She likes coffee.', 'The sun rises in the east.']
            },
            'points': 10,
            'order_index': 1,
            'is_published': True
        },
        {
            'title': 'Basic Vocabulary: Family',
            'description': 'Learn essential family-related vocabulary',
            'category': vocabulary_category,
            'skill_level': beginner_level,
            'content': {
                'text': 'Learn common words to describe family members.',
                'vocabulary': ['mother', 'father', 'sister', 'brother', 'grandmother', 'grandfather']
            },
            'points': 10,
            'order_index': 1,
            'is_published': True
        },
        {
            'title': 'Past Simple Tense',
            'description': 'Learn how to talk about past events',
            'category': grammar_category,
            'skill_level': elementary_level,
            'content': {
                'text': 'The past simple tense is used to describe completed actions in the past.',
                'examples': ['I worked yesterday.', 'She visited her friend.', 'They played football.']
            },
            'points': 15,
            'order_index': 2,
            'is_published': True
        },
        {
            'title': 'Common Adjectives',
            'description': 'Expand your vocabulary with common adjectives',
            'category': vocabulary_category,
            'skill_level': elementary_level,
            'content': {
                'text': 'Learn useful adjectives to describe people, places, and things.',
                'vocabulary': ['big', 'small', 'beautiful', 'ugly', 'fast', 'slow', 'happy', 'sad']
            },
            'points': 15,
            'order_index': 2,
            'is_published': True
        }
    ]
    
    for lesson_data in lessons:
        lesson, created = Lesson.objects.get_or_create(
            title=lesson_data['title'],
            defaults=lesson_data
        )
        if created:
            print(f"Created lesson: {lesson.title}")
        else:
            print(f"Lesson already exists: {lesson.title}")
    
    print("Sample data creation completed!")
    print(f"Total categories: {Category.objects.count()}")
    print(f"Total skill levels: {SkillLevel.objects.count()}")
    print(f"Total lessons: {Lesson.objects.count()}")

if __name__ == '__main__':
    create_sample_data()