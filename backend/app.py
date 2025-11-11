from flask import Flask, send_from_directory
import os
from flask_cors import CORS
from models import db
from routes.quiz import quiz_bp
from routes.user import user
from routes.paper import paper_bp
from routes.excelinsert import excelInsert_bp

app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
print("📁 Current working directory:", os.getcwd())
print("📁 Files here:", os.listdir(os.getcwd()))
print("📁 Frontend folder exists?", os.path.exists("../frontend/build"))

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

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    build_dir = app.static_folder
    index_path = os.path.join(build_dir, "index.html")
    if path != "" and os.path.exists(os.path.join(build_dir, path)):
        return send_from_directory(build_dir, path)
    return send_from_directory(build_dir, "index.html")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000, host="0.0.0.0")
