# SHL Assessment Recommendation System

This application uses Python Flask for the backend and HTML, CSS, and JavaScript for the frontend to provide an intelligent recommendation system for SHL assessments.

## Features

- Natural language query processing
- Assessment recommendations based on relevance
- Evaluation metrics (Mean Recall@K and MAP@K)
- Responsive and attractive UI
- REST API for integration with other systems

## Installation

### Prerequisites

- Python 3.6 or higher
- pip (Python package manager)

### Setup

1. Clone the repository:
```
git clone https://github.com/JayaprakashDirisala07/shl-recommendation-system.git
cd shl-recommendation-system
```

2. Create a virtual environment (recommended):
```
python -m venv venv
```

3. Activate the virtual environment:
   - On Windows:
   ```
   venv\Scripts\activate
   ```
   - On macOS/Linux:
   ```
   source venv/bin/activate
   ```

4. Install dependencies:
```
pip install flask
```

5. Run the application:
```
python app.py
```

6. Open your browser and navigate to [http://127.0.0.1:5000/](http://127.0.0.1:5000/)

## API Documentation

### Recommendations Endpoint

- **URL**: `/api/recommendations`
- **Method**: POST
- **Request Body**:
```json
{
  "query": "Java developers with 40 min time limit"
}
```
- **Response**:
```json
{
  "status": "success",
  "query": "Java developers with 40 min time limit",
  "recommendations": [
    {
      "name": "Core Java (Entry Level) (New)",
      "url": "https://www.shl.com/solutions/products/product-catalog/view/core-java-entry-level-new/",
      "remoteTestingSupport": true,
      "adaptiveSupport": true,
      "duration": "35 minutes",
      "testType": "Programming"
    },
    // Additional recommendations...
  ]
}
```

### Evaluation Endpoint

- **URL**: `/api/evaluation`
- **Method**: GET
- **Query Parameters**:
  - `k` (optional): Number of top results to consider in metrics (default: 3)
- **Response**:
```json
{
  "status": "success",
  "metrics": {
    "meanRecallAtK": 0.8533,
    "mapAtK": 0.7925,
    "k": 3
  }
}
```

## Evaluation Methodology

The system's performance is evaluated using two key metrics:

1. **Mean Recall@K**: Measures how many of the relevant assessments were retrieved in the top K recommendations, averaged across all test queries.
2. **MAP@K** (Mean Average Precision@K): Evaluates both the relevance and ranking order of retrieved assessments by calculating Precision@k at each relevant result and averaging it over all queries.

## Project Structure

- `app.py`: Main Flask application
- `templates/`: HTML templates
  - `index.html`: Main application page
  - `api_documentation.html`: API documentation
- `static/`: Static assets
  - `css/`: Stylesheets
  - `js/`: JavaScript files
- `data/`: JSON data files
  - `assessments.json`: Assessment data
  - `test_queries.json`: Test queries for evaluation

## Algorithm Overview

The recommendation system works by:

1. Tokenizing the natural language query
2. Extracting relevant keywords and time constraints
3. Calculating relevance scores for each assessment based on keyword matches and duration constraints
4. Ranking assessments by their relevance scores
5. Returning the top-ranked recommendations

## Example Queries

- "I am hiring for Java developers who can collaborate with business teams. Looking for assessments that can be completed in 40 minutes."
- "Need technical sales assessments for entry-level positions with a maximum duration of 1 hour"
- "Financial professional test for banking, must test numerical ability"

## License



Copyright (c) 2025 JayaprakashDirisala07

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
