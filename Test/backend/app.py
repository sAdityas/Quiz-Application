from flask import Flask
from flask_cors import CORS
from models import db
from routes.quiz import quiz_bp
from routes.user import user
from routes.paper import paper_bp
from routes.excelinsert import excelInsert_bp

app = Flask(__name__)
CORS(app)

# Single unified database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///main.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

app.register_blueprint(quiz_bp, url_prefix='/api/quiz')
app.register_blueprint(user, url_prefix='/api/user')
app.register_blueprint(paper_bp, url_prefix='/api/paper')
app.register_blueprint(excelInsert_bp, url_prefix='/api/excelInsert')

@app.before_request
def create_tables():
    db.create_all()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000, host="0.0.0.0")
