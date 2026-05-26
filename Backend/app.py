import os
from dotenv import load_dotenv
load_dotenv()

from flask import Flask
from flask_cors import CORS
from database import db
from routes.sessions import sessions_bp
from routes.questions import questions_bp
from routes.answers import answers_bp

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///interview_prep.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = "dev-secret-change-in-prod"

    # Get allowed origins from environment or use defaults
    allowed_origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173,http://localhost:5174').split(',')
    
    CORS(app, resources={r"/api/*": {"origins": allowed_origins, "allow_headers": ["Content-Type"]}})

    db.init_app(app)

    app.register_blueprint(sessions_bp, url_prefix="/api/sessions")
    app.register_blueprint(questions_bp, url_prefix="/api/questions")
    app.register_blueprint(answers_bp, url_prefix="/api/answers")

    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('FLASK_ENV') == 'development'
    app.run(debug=debug, port=port, host='0.0.0.0')