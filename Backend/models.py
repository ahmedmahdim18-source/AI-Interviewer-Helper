from database import db
from datetime import datetime


class Session(db.Model):
    __tablename__ = "sessions"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    job_description = db.Column(db.Text, nullable=False)
    company = db.Column(db.String(255), nullable=True)
    role = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    questions = db.relationship("Question", backref="session", cascade="all, delete-orphan", lazy=True)

    def to_dict(self, include_questions=False):
        data = {
            "id": self.id,
            "title": self.title,
            "job_description": self.job_description,
            "company": self.company,
            "role": self.role,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
        if include_questions:
            data["questions"] = [q.to_dict(include_answers=True) for q in self.questions]
        return data


class Question(db.Model):
    __tablename__ = "questions"

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey("sessions.id"), nullable=False)
    text = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), nullable=False)  # "behavioral" or "technical"
    order = db.Column(db.Integer, nullable=False, default=0)

    answers = db.relationship("Answer", backref="question", cascade="all, delete-orphan", lazy=True)

    def to_dict(self, include_answers=False):
        data = {
            "id": self.id,
            "session_id": self.session_id,
            "text": self.text,
            "type": self.type,
            "order": self.order,
        }
        if include_answers:
            data["answers"] = [a.to_dict() for a in self.answers]
        return data


class Answer(db.Model):
    __tablename__ = "answers"

    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey("questions.id"), nullable=False)
    text = db.Column(db.Text, nullable=False)
    input_mode = db.Column(db.String(20), nullable=False, default="text")  # "text" or "voice"
    feedback = db.Column(db.Text, nullable=True)  # JSON string of feedback object
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        import json
        return {
            "id": self.id,
            "question_id": self.question_id,
            "text": self.text,
            "input_mode": self.input_mode,
            "feedback": json.loads(self.feedback) if self.feedback else None,
            "created_at": self.created_at.isoformat(),
        }