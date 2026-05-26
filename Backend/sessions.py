from flask import Blueprint, request, jsonify
from database import db
from models import Session, Question
from claude_service import generate_questions

sessions_bp = Blueprint("sessions", __name__)


@sessions_bp.route("/", methods=["GET"])
def list_sessions():
    sessions = Session.query.order_by(Session.updated_at.desc()).all()
    return jsonify([s.to_dict() for s in sessions])


@sessions_bp.route("/", methods=["POST"])
def create_session():
    data = request.get_json()

    job_description = data.get("job_description", "").strip()
    if not job_description:
        return jsonify({"error": "job_description is required"}), 400

    company = data.get("company", "").strip() or None
    role = data.get("role", "").strip() or None
    title = data.get("title", "").strip()
    if not title:
        title = f"{role or 'Interview'} at {company or 'Unknown'}"

    # Create session
    session = Session(
        title=title,
        job_description=job_description,
        company=company,
        role=role,
    )
    db.session.add(session)
    db.session.flush()  # get session.id before generating questions

    # Generate questions via Claude
    try:
        questions_data = generate_questions(job_description, company, role)
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to generate questions: {str(e)}"}), 500

    for q in questions_data:
        question = Question(
            session_id=session.id,
            text=q["text"],
            type=q["type"],
            order=q.get("order", 0),
        )
        db.session.add(question)

    db.session.commit()
    return jsonify(session.to_dict(include_questions=True)), 201


@sessions_bp.route("/<int:session_id>", methods=["GET"])
def get_session(session_id):
    session = Session.query.get_or_404(session_id)
    return jsonify(session.to_dict(include_questions=True))


@sessions_bp.route("/<int:session_id>", methods=["DELETE"])
def delete_session(session_id):
    session = Session.query.get_or_404(session_id)
    db.session.delete(session)
    db.session.commit()
    return jsonify({"message": "Session deleted"}), 200