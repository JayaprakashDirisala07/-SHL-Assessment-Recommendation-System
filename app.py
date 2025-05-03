
from flask import Flask, request, jsonify, render_template, send_from_directory
import json
import re
import os

app = Flask(__name__, static_url_path='', static_folder='static')

# Load assessments data
with open('data/assessments.json', 'r') as file:
    assessments_data = json.load(file)

# Load test queries data for evaluation
with open('data/test_queries.json', 'r') as file:
    test_queries = json.load(file)
    
# Simple tokenization of text
def tokenize(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    tokens = text.split()  # Split on whitespace
    return [word for word in tokens if len(word) > 2]  # Filter out short words

# Extract keywords from text
def extract_keywords(text):
    stop_words = {
        'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
        'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
        'for', 'of', 'on', 'with', 'at', 'from', 'to', 'in', 'that', 'this',
        'these', 'those', 'am', 'as', 'by', 'can', 'could', 'may', 'might',
        'must', 'need', 'ought', 'shall', 'should', 'will', 'would'
    }
    
    tokens = tokenize(text)
    return [word for word in tokens if word not in stop_words]

# Extract time constraints from text (in minutes)
def extract_time_constraint(text):
    # Look for common time patterns like "30 minutes", "1 hour", etc.
    minutes_match = re.search(r'(\d+)\s*(?:min|minute|minutes)', text, re.IGNORECASE)
    if minutes_match:
        return int(minutes_match.group(1))
    
    hours_match = re.search(r'(\d+)\s*(?:hr|hour|hours)', text, re.IGNORECASE)
    if hours_match:
        return int(hours_match.group(1)) * 60
    
    return None

# Calculate relevance score for an assessment
def calculate_relevance_score(assessment, keywords, time_constraint):
    score = 0
    
    # Convert assessment details to searchable string
    assessment_text = f"{assessment['name']} {assessment['testType']}".lower()
    
    # Score based on keyword matches
    for keyword in keywords:
        if keyword in assessment_text:
            score += 3
    
    # Score based on time constraint
    if time_constraint is not None:
        # Parse duration like "30 minutes" to just the number
        duration_minutes = int(assessment['duration'].split(' ')[0])
        
        # Higher score if assessment duration is within the time constraint
        if duration_minutes <= time_constraint:
            score += 2
        else:
            score -= 2  # Penalty for exceeding time constraint
    
    return score

# Get recommendations based on query
def get_recommendations(query, max_results=10):
    keywords = extract_keywords(query)
    time_constraint = extract_time_constraint(query)
    
    # Score and rank assessments
    scored_assessments = []
    for assessment in assessments_data['assessments']:
        score = calculate_relevance_score(assessment, keywords, time_constraint)
        scored_assessments.append({
            'assessment': assessment,
            'score': score
        })
    
    # Sort by score (descending)
    scored_assessments.sort(key=lambda x: x['score'], reverse=True)
    
    # Return top N results
    return [item['assessment'] for item in scored_assessments[:max_results]]

# Calculate evaluation metrics for the recommendation system
def calculate_evaluation_metrics(k=3):
    mean_recall = 0
    mean_average_precision = 0
    total_queries = len(test_queries)
    
    for test_case in test_queries:
        # Get recommendations
        recommendations = get_recommendations(test_case['query'], 10)
        recommended_names = [rec['name'] for rec in recommendations]
        
        # Calculate Recall@K
        relevant = 0
        for i in range(min(k, len(recommended_names))):
            if recommended_names[i] in test_case['relevantAssessments']:
                relevant += 1
        recall = relevant / min(k, len(test_case['relevantAssessments']))
        mean_recall += recall
        
        # Calculate AP@K
        ap = 0
        relevant_count = 0
        
        for i in range(min(k, len(recommended_names))):
            is_relevant = 1 if recommended_names[i] in test_case['relevantAssessments'] else 0
            if is_relevant:
                relevant_count += 1
                ap += relevant_count / (i + 1)
        
        if relevant_count > 0:
            ap /= min(k, len(test_case['relevantAssessments']))
        
        mean_average_precision += ap
    
    # Calculate mean metrics
    mean_recall /= total_queries
    mean_average_precision /= total_queries
    
    return {
        'meanRecallAtK': mean_recall,
        'mapAtK': mean_average_precision,
        'k': k
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/recommendations', methods=['POST'])
def api_recommendations():
    data = request.json
    query = data.get('query', '')
    
    if not query:
        return jsonify({'status': 'error', 'message': 'Query is required'})
    
    recommendations = get_recommendations(query, 10)
    
    return jsonify({
        'status': 'success',
        'query': query,
        'recommendations': recommendations
    })

@app.route('/api/evaluation', methods=['GET'])
def api_evaluation():
    k = request.args.get('k', default=3, type=int)
    metrics = calculate_evaluation_metrics(k)
    
    return jsonify({
        'status': 'success',
        'metrics': metrics
    })

@app.route('/api/documentation')
def api_documentation():
    return render_template('api_documentation.html')

if __name__ == '__main__':
    # Create data directory if it doesn't exist
    if not os.path.exists('data'):
        os.makedirs('data')
    
    app.run(debug=True)