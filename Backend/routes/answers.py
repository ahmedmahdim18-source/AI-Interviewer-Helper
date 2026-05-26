from flask import Blueprint, request, jsonify
from database import db
from models import Answer, Question
from claude_service import generate_feedback
import json

answers_bp = Blueprint("answers", __name__)


@answers_bp.route("/", methods=["POST"])
def submit_answer():
    data = request.get_json()

    question_id = data.get("question_id")
    answer_text = data.get("text", "").strip()
    input_mode = data.get("input_mode", "text")  # "text" or "voice"

    if not question_id or not answer_text:
        return jsonify({"error": "question_id and text are required"}), 400

    question = Question.query.get_or_404(question_id)

    # Generate feedback via Claude
    try:
        feedback = generate_feedback(question.text, question.type, answer_text)
    except Exception as e:
        return jsonify({"error": f"Failed to generate feedback: {str(e)}"}), 500

    answer = Answer(
        question_id=question_id,
        text=answer_text,
        input_mode=input_mode,
        feedback=json.dumps(feedback),
    )
    db.session.add(answer)
    db.session.commit()

    return jsonify(answer.to_dict()), 201


@answers_bp.route("/<int:answer_id>", methods=["GET"])
def get_answer(answer_id):
    answer = Answer.query.get_or_404(answer_id)
    return jsonify(answer.to_dict())


@answers_bp.route("/question/<int:question_id>", methods=["GET"])
def get_answers_for_question(question_id):
    Question.query.get_or_404(question_id)
    answers = (
        Answer.query
        .filter_by(question_id=question_id)
        .order_by(Answer.created_at.desc())
        .all()
    )
    return jsonify([a.to_dict() for a in answers])
