from flask import Flask, send_from_directory, jsonify
import os
from flask_cors import CORS
from models import db
from routes.quiz import quiz_bp
from routes.user import user
from routes.paper import paper_bp
from routes.excelinsert import excelInsert_bp
from pathlib import Path


HERE = Path(__file__).resolve().parent      # backend/
FRONTEND_BUILD = (HERE / "frontend_build").resolve()  # backend/frontend_build

app = Flask(__name__, static_folder=str(FRONTEND_BUILD), static_url_path="/")


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
    target = FRONTEND_BUILD / path
    if path != "" and target.exists() and target.is_file():
        return send_from_directory(str(FRONTEND_BUILD), path)
    index_file = FRONTEND_BUILD / "index.html"
    if index_file.exists():
        return send_from_directory(str(FRONTEND_BUILD), "index.html")
    return jsonify({"status": "ok", "message": "API running but frontend build not found"}), 200

@app.route("/health")
def health():
    return {"status":"ok"}, 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000, host="0.0.0.0")
