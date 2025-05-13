from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/exercises')
def exercises():
    return render_template('exercises.html')

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/planner')
def planner():
    return render_template('planner.html')

if __name__ == '__main__':
    app.run(debug=True)