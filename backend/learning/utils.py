import logging
from datetime import datetime, timedelta
from django.utils import timezone
from django.db import transaction, models
from django.contrib.auth import get_user_model
from .models import (
    UserPoints, Badge, UserBadge, UserStreak, 
    EssaySubmission, SpeechSubmission, UserProgress, Submission
)

User = get_user_model()
logger = logging.getLogger(__name__)


def award_points(user, points, source, source_id, description=""):
    """Award points to a user for completing activities"""
    try:
        with transaction.atomic():
            UserPoints.objects.create(
                user=user,
                points=points,
                source=source,
                source_id=source_id,
                description=description
            )
            logger.info(f"Awarded {points} points to user {user.username} for {description}")
    except Exception as e:
        logger.error(f"Error awarding points to user {user.username}: {str(e)}")


def update_user_streak(user):
    """Update user's learning streak"""
    try:
        with transaction.atomic():
            streak, created = UserStreak.objects.get_or_create(
                user=user,
                defaults={
                    'current_streak': 1,
                    'longest_streak': 1,
                    'last_activity_date': timezone.now().date()
                }
            )
            
            today = timezone.now().date()
            yesterday = today - timedelta(days=1)
            
            if not created:
                if streak.last_activity_date == today:
                    # Already updated today, no change needed
                    return streak
                elif streak.last_activity_date == yesterday:
                    # Consecutive day, increment streak
                    streak.current_streak += 1
                    streak.longest_streak = max(streak.longest_streak, streak.current_streak)
                else:
                    # Streak broken, reset to 1
                    streak.current_streak = 1
                
                streak.last_activity_date = today
                streak.save()
            
            logger.info(f"Updated streak for user {user.username}: {streak.current_streak} days")
            return streak
            
    except Exception as e:
        logger.error(f"Error updating streak for user {user.username}: {str(e)}")
        return None


def check_and_award_badges(user):
    """Check if user qualifies for any new badges and award them"""
    try:
        # Get all active badges that user hasn't earned yet
        earned_badge_ids = UserBadge.objects.filter(user=user).values_list('badge_id', flat=True)
        available_badges = Badge.objects.filter(is_active=True).exclude(id__in=earned_badge_ids)
        
        for badge in available_badges:
            if _check_badge_criteria(user, badge):
                with transaction.atomic():
                    UserBadge.objects.create(user=user, badge=badge)
                    
                    # Award bonus points for earning badge
                    award_points(
                        user=user,
                        points=badge.points_reward,
                        source='badge',
                        source_id=badge.id,
                        description=f"Earned badge: {badge.name}"
                    )
                    
                    logger.info(f"Awarded badge '{badge.name}' to user {user.username}")
                    
    except Exception as e:
        logger.error(f"Error checking badges for user {user.username}: {str(e)}")


def _check_badge_criteria(user, badge):
    """Check if user meets the criteria for a specific badge"""
    criteria = badge.criteria
    
    try:
        # Points-based badges
        if 'total_points' in criteria:
            user_points = UserPoints.objects.filter(user=user).aggregate(
                total=models.Sum('points')
            )['total'] or 0
            if user_points < criteria['total_points']:
                return False
        
        # Lesson completion badges
        if 'lessons_completed' in criteria:
            completed_lessons = UserProgress.objects.filter(
                user=user, completed=True
            ).count()
            if completed_lessons < criteria['lessons_completed']:
                return False
        
        # Exercise completion badges
        if 'exercises_completed' in criteria:
            completed_exercises = Submission.objects.filter(
                user=user, is_correct=True
            ).count()
            if completed_exercises < criteria['exercises_completed']:
                return False
        
        # Streak badges
        if 'streak_days' in criteria:
            streak = UserStreak.objects.filter(user=user).first()
            if not streak or streak.longest_streak < criteria['streak_days']:
                return False
        
        # Category-specific badges
        if 'category_lessons' in criteria:
            for category_id, required_count in criteria['category_lessons'].items():
                completed_in_category = UserProgress.objects.filter(
                    user=user,
                    completed=True,
                    lesson__category_id=category_id
                ).count()
                if completed_in_category < required_count:
                    return False
        
        # Perfect score badges
        if 'perfect_scores' in criteria:
            perfect_scores = Submission.objects.filter(
                user=user, score=100.0
            ).count()
            if perfect_scores < criteria['perfect_scores']:
                return False
        
        return True
        
    except Exception as e:
        logger.error(f"Error checking criteria for badge {badge.name}: {str(e)}")
        return False


# Placeholder functions for external processing
# In a real application, these would integrate with external APIs

def process_essay_submission(essay_submission_id):
    """Process essay submission for grammar and content analysis"""
    try:
        essay_submission = EssaySubmission.objects.get(id=essay_submission_id)
        essay_submission.processing_status = 'processing'
        essay_submission.save()
        
        # Simulate processing delay
        # In real implementation, this would call LanguageTool API or similar
        
        # Mock scores (in real app, these would come from external API)
        essay_submission.grammar_score = 85.0
        essay_submission.spelling_score = 92.0
        essay_submission.vocabulary_score = 78.0
        essay_submission.structure_score = 80.0
        
        # Calculate overall score
        overall_score = (
            essay_submission.grammar_score * 0.3 +
            essay_submission.spelling_score * 0.2 +
            essay_submission.vocabulary_score * 0.25 +
            essay_submission.structure_score * 0.25
        )
        
        # Update submission with scores
        submission = essay_submission.submission
        submission.score = overall_score
        submission.is_correct = overall_score >= 70.0
        submission.feedback = f"Grammar: {essay_submission.grammar_score}%, Spelling: {essay_submission.spelling_score}%, Vocabulary: {essay_submission.vocabulary_score}%, Structure: {essay_submission.structure_score}%"
        submission.save()
        
        # Mock detailed feedback
        essay_submission.feedback_json = {
            'grammar_issues': [
                {'line': 1, 'issue': 'Subject-verb disagreement', 'suggestion': 'Use "are" instead of "is"'},
                {'line': 3, 'issue': 'Missing article', 'suggestion': 'Add "the" before "book"'}
            ],
            'spelling_errors': [
                {'word': 'recieve', 'suggestion': 'receive', 'line': 2}
            ],
            'vocabulary_suggestions': [
                {'word': 'good', 'suggestions': ['excellent', 'outstanding', 'remarkable'], 'line': 4}
            ],
            'structure_feedback': [
                'Consider adding transition words between paragraphs',
                'The conclusion could be stronger'
            ]
        }
        
        essay_submission.processing_status = 'completed'
        essay_submission.processed_at = timezone.now()
        essay_submission.save()
        
        # Award points if score is good
        if submission.is_correct:
            award_points(
                user=submission.user,
                points=submission.exercise.points,
                source='exercise',
                source_id=submission.exercise.id,
                description=f"Completed essay: {submission.exercise.title}"
            )
        
        logger.info(f"Processed essay submission {essay_submission_id} with score {overall_score}")
        
    except EssaySubmission.DoesNotExist:
        logger.error(f"Essay submission {essay_submission_id} not found")
    except Exception as e:
        logger.error(f"Error processing essay submission {essay_submission_id}: {str(e)}")
        # Mark as failed
        try:
            essay_submission = EssaySubmission.objects.get(id=essay_submission_id)
            essay_submission.processing_status = 'failed'
            essay_submission.save()
        except:
            pass


def process_speech_submission(speech_submission_id):
    """Process speech submission for pronunciation analysis"""
    try:
        speech_submission = SpeechSubmission.objects.get(id=speech_submission_id)
        speech_submission.processing_status = 'processing'
        speech_submission.save()
        
        # Simulate processing delay
        # In real implementation, this would call Google Speech-to-Text API or similar
        
        # Mock transcript and scores
        speech_submission.transcript = "Hello, my name is John and I am learning English."
        speech_submission.pronunciation_score = 88.0
        speech_submission.fluency_score = 82.0
        speech_submission.accuracy_score = 90.0
        
        # Calculate overall score
        overall_score = (
            speech_submission.pronunciation_score * 0.4 +
            speech_submission.fluency_score * 0.3 +
            speech_submission.accuracy_score * 0.3
        )
        
        # Update submission with scores
        submission = speech_submission.submission
        submission.score = overall_score
        submission.is_correct = overall_score >= 70.0
        submission.feedback = f"Pronunciation: {speech_submission.pronunciation_score}%, Fluency: {speech_submission.fluency_score}%, Accuracy: {speech_submission.accuracy_score}%"
        submission.save()
        
        # Mock detailed feedback
        speech_submission.feedback_json = {
            'pronunciation_feedback': [
                {'word': 'learning', 'score': 85, 'feedback': 'Good pronunciation, slight improvement needed on the "r" sound'},
                {'word': 'English', 'score': 92, 'feedback': 'Excellent pronunciation'}
            ],
            'fluency_feedback': [
                'Good pace overall',
                'Consider reducing pauses between words',
                'Natural rhythm in most sentences'
            ],
            'accuracy_feedback': [
                'All words correctly identified',
                'Clear articulation',
                'Good volume and clarity'
            ],
            'overall_feedback': 'Great job! Focus on reducing hesitation and maintaining consistent pace.'
        }
        
        speech_submission.processing_status = 'completed'
        speech_submission.processed_at = timezone.now()
        speech_submission.save()
        
        # Award points if score is good
        if submission.is_correct:
            award_points(
                user=submission.user,
                points=submission.exercise.points,
                source='exercise',
                source_id=submission.exercise.id,
                description=f"Completed speaking exercise: {submission.exercise.title}"
            )
        
        logger.info(f"Processed speech submission {speech_submission_id} with score {overall_score}")
        
    except SpeechSubmission.DoesNotExist:
        logger.error(f"Speech submission {speech_submission_id} not found")
    except Exception as e:
        logger.error(f"Error processing speech submission {speech_submission_id}: {str(e)}")
        # Mark as failed
        try:
            speech_submission = SpeechSubmission.objects.get(id=speech_submission_id)
            speech_submission.processing_status = 'failed'
            speech_submission.save()
        except:
            pass


# Note: In a production environment, the process_essay_submission and 
# process_speech_submission functions would be implemented as Celery tasks
# for asynchronous processing. For now, they're implemented as regular functions
# with .delay() method calls that would need to be replaced with direct calls
# or proper Celery task decorators.