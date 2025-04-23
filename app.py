
from flask import Flask, render_template, request, redirect, url_for, session
import json, csv, datetime, os

app = Flask(__name__)
app.secret_key = 'super-secret-key'  # replace in production

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(BASE_DIR, 'data', 'lessons.json')) as f:
    LESSONS = json.load(f)
with open(os.path.join(BASE_DIR, 'data', 'quiz.json')) as f:
    QUIZ = json.load(f)

LOG_PATH = os.path.join(BASE_DIR, 'logs.csv')
if not os.path.exists(LOG_PATH):
    with open(LOG_PATH, 'w', newline='') as fp:
        writer = csv.writer(fp)
        writer.writerow(['timestamp', 'page', 'index', 'data'])

def stamp(page, idx, data=''):
    with open(LOG_PATH, 'a', newline='') as fp:
        writer = csv.writer(fp)
        writer.writerow([datetime.datetime.utcnow().isoformat(), page, idx, data])

@app.route('/')
def home():
    # reset session
    session.clear()
    stamp('home', 0)
    return render_template('home.html')

@app.route('/learn/<int:n>')
def learn(n):
    if n < 1 or n > len(LESSONS):
        return redirect(url_for('home'))
    lesson = LESSONS[n-1]
    stamp('learn', n)
    return render_template('learn.html', lesson=lesson, n=n, total=len(LESSONS))

@app.route('/quiz/<int:n>', methods=['GET', 'POST'])
def quiz(n):
    if n < 1 or n > len(QUIZ):
        return redirect(url_for('result'))
    if request.method == 'POST':
        choice = request.form.get('choice', '')
        answers = session.setdefault('answers', {})
        answers[str(n)] = choice
        session['answers'] = answers
        stamp('quiz', n, choice)
        return redirect(url_for('quiz', n=n+1) if n < len(QUIZ) else url_for('result'))
    q = QUIZ[n-1]
    return render_template('quiz.html', q=q, n=n, total=len(QUIZ))

@app.route('/result')
def result():
    answers = session.get('answers', {})
    correct = 0
    for q in QUIZ:
        if answers.get(str(q['id'])) == q['answer']:
            correct += 1
    score = f"{correct} / {len(QUIZ)}"
    stamp('result', 0, score)
    return render_template('result.html', score=score)

if __name__ == '__main__':
    app.run(debug=True)
