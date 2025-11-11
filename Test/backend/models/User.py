from models import db

class User(db.Model):
    __tablename__ = 'user' 
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    tclid = db.Column(db.String(25), nullable=False)
    def to_dict(self):
        return {
            'id' : self.id,
            'name': self.name,
            'score': self.score,
            "TCL Id" : self.tclid,
        }