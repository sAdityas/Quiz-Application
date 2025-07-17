from models import db
from datetime import datetime

class ExcelInsert(db.Model):
    __tablename__ = 'excel'

    excelId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created_at = db.Column(db.DateTime, default=datetime.now())

    def to_dict(self):
        return{
            'Id' : self.excelId,
            'Created at': self.created_at
        }

