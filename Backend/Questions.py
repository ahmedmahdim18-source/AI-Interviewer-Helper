from flask import Blueprint, jsonify
from models import Question, Session

questions_bp = Blueprint("questions", __name__)


@questions_bp.route("/session/<int:session_id>", methods=["GET"])
def get_questions(session_id):
    Session.query.get_or_404(session_id)  # 404 if session doesn't exist
    questions = (
        Question.query
        .filter_by(session_id=session_id)
        .order_by(Question.order)
        .all()
    )
    return jsonify([q.to_dict(include_answers=True) for q in questions])


@questions_bp.route("/<int:question_id>", methods=["GET"])
def get_question(question_id):
    question = Question.query.get_or_404(question_id)
    return jsonify(question.to_dict(include_answers=True))