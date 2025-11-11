from flask import Blueprint, request, jsonify
from models import db
from models.Paper import Paper
import random

paper_bp = Blueprint('paper', __name__)

@paper_bp.route('/add', methods=['POST','GET'])
def submit_paper():
    # data = request.get_json()
    title =['IT','HR','E&D','Maintenance','Production','Dispatch','Vendor','Purchase','Finance','TPM','Quality']

   
    for i in range(len(title)):
         # ensure unique ID
        while True:
            random_id = random.randint(10000000, 99999999)
            if not Paper.query.get(random_id):
                break
        new_paper = Paper(paperId=random_id, title=title[i])
        db.session.add(new_paper)
    db.session.commit()

    return jsonify({
        "message": "Paper submitted successfully.",
        "paperId": new_paper.paperId
    })

@paper_bp.route('/all', methods=["GET",'POST'])
def get_all_papers():
    papers = Paper.query.all()
    return jsonify({"papers": [p.to_dict() for p in papers]})




