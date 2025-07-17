from models import db

class QuizQuestion(db.Model):
    __tablename__ = 'quiz'

    id = db.Column(db.Integer, primary_key=True)
    qs = db.Column(db.String(256), nullable=False)
    options = db.Column(db.PickleType, nullable=False)
    correct_option = db.Column(db.Integer, nullable=False)
    paper_id = db.Column(db.Integer, db.ForeignKey('paper.paperId'), nullable=False)

    def to_dict(self, include_answer=False):
        data = {
            "id": self.id,
            "Question": self.qs,
            "options": self.options,
            "paper_id": self.paper_id
        }
        if include_answer:
            data["correct_option"] = self.correct_option
        return data
