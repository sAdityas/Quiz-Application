from flask import Blueprint, jsonify, request
from models import db
from models.Qs import QuizQuestion
from models.Paper import Paper

quiz_bp = Blueprint('quiz', __name__)

# ------------------- GET all questions (with answers, for admin) -------------------
@quiz_bp.route('/view', methods=["GET"])
def get_all_quiz():
    questions = QuizQuestion.query.all()
    return jsonify({"Questions": [q.to_dict(include_answer=True) for q in questions]})


# ------------------- GET questions by paper ID -------------------
@quiz_bp.route('/<int:paper_id>', methods=['GET'])
def get_questions_by_paper(paper_id):
    questions = QuizQuestion.query.filter_by(paper_id=paper_id).all()
    return jsonify({"Questions": [q.to_dict(include_answer=True) for q in questions]})


# ------------------- ADD a new question -------------------
@quiz_bp.route('/add', methods=["POST"])
def add_question():
    data = request.get_json()
    paper_id = data.get("paperId")
    qs = data.get("qs")
    options = data.get("options")
    correct_option = data.get("correct_option")

    if not all([paper_id, qs, options]) or correct_option is None:
        return jsonify({"message": "Missing data"}), 400


    new_q = QuizQuestion(
        paper_id=paper_id,
        qs=qs,
        options=options,
        correct_option=correct_option
    )

    db.session.add(new_q)
    db.session.commit()
    return jsonify({"message": "Question added", "question_id": new_q.id})


# ------------------- REMOVE ALL QUESTIONS -------------------
@quiz_bp.route("/removeAll/<int:paper_id>", methods=["POST"])
def remove_all_questions(paper_id):
    try:
        Question = QuizQuestion.query.filter(QuizQuestion.paper_id == paper_id)
        c = Question.count()
        if c == 0:
            return jsonify({"error":"No Question to delete"})

        Question.delete()
        db.session.commit()
        print(f"Deleted  questions from paper Id {paper_id}.")
        return jsonify({"message": f"Deleted  questions from paper Id {paper_id}."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------------- DELETE question by ID -------------------
@quiz_bp.route('/<int:question_id>', methods=["DELETE"])
def delete_question(question_id):
    try:
        question = QuizQuestion.query.get(question_id)
        if not question:
            return jsonify({"error": "Question not found"}), 404
        db.session.delete(question)
        db.session.commit()
        return jsonify({"message": f"Question {question_id} deleted."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------------- SUBMIT quiz and calculate score -------------------
@quiz_bp.route('/submit', methods=["POST"])
def submit_quiz():
    data = request.get_json()
    submitted_answer = data.get('answers', {})
    paper_id = data.get('paper_id')

    if not paper_id:
        return jsonify({"error": "Missing paper_id"}), 400

    questions = QuizQuestion.query.filter_by(paper_id=paper_id).all()

    if not questions:
        return jsonify({"error": "No questions found for this paper ID"}), 404

    score = 0
    results = []

    for question in questions:
        qid = str(question.id)
        selected = submitted_answer.get(qid, -1)
        is_correct = int(selected) == int(question.correct_option)
        if is_correct:
            score += 1
        results.append({
            "question_id": qid,
            "correct": is_correct,
            "correct_option": question.correct_option,
            "selected_option": selected,
        })

    return jsonify({
        "score": score,
        "total": len(questions),
        "results": results
    })
