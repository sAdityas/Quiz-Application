from models import db
from datetime import datetime

class Paper(db.Model):
    __tablename__ = 'paper'

    paperId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    title = db.Column(db.String(255))

    # One-to-many relationship
    questions = db.relationship('QuizQuestion', backref='paper', lazy=True)

    def to_dict(self):
        return {
            "paperId": self.paperId,
            "title": self.title,
            "created_at": self.created_at.isoformat()
        }
