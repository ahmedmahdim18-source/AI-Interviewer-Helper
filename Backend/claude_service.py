import anthropic
import json

client = anthropic.Anthropic()
MODEL = "claude-sonnet-4-20250514"


def generate_questions(job_description: str, company: str = None, role: str = None, behavioral_count: int = 5, technical_count: int = 5) -> list[dict]:
    """
    Given a job description, return behavioral and technical questions.
    Returns a list of dicts: [{ "text": ..., "type": "behavioral"|"technical", "order": int }]
    """
    # Ensure counts are within reasonable bounds
    behavioral_count = max(1, min(20, behavioral_count))
    technical_count = max(1, min(20, technical_count))
    total_questions = behavioral_count + technical_count
    
    context = f"Company: {company}\n" if company else ""
    context += f"Role: {role}\n" if role else ""

    prompt = f"""You are an expert technical interviewer. Given this job description, generate exactly {behavioral_count} behavioral questions and {technical_count} technical questions tailored to this specific role.

{context}Job Description:
{job_description}

Respond ONLY with a valid JSON array. No preamble, no markdown, no explanation. Format:
[
  {{"text": "question text", "type": "behavioral", "order": 1}},
  {{"text": "question text", "type": "behavioral", "order": 2}},
  ...
  {{"text": "question text", "type": "technical", "order": {behavioral_count + 1}}},
  ...
]

Rules:
- Behavioral questions should use the STAR method framing (tell me about a time..., describe a situation...)
- Technical questions should be specific to the skills and stack mentioned in the JD
- Questions should be realistic, not generic
- Return exactly {total_questions} questions: {behavioral_count} behavioral (orders 1-{behavioral_count}), {technical_count} technical (orders {behavioral_count + 1}-{total_questions})"""

    message = client.messages.create(
        model=MODEL,
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = message.content[0].text.strip()
    # Strip markdown fences if present
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    questions = json.loads(raw)
    return questions


def generate_feedback(question_text: str, question_type: str, answer_text: str) -> dict:
    """
    Given a question and the candidate's answer, return structured feedback.
    Returns a dict: { "score": int (1-10), "strengths": [...], "gaps": [...], "suggestion": str }
    """
    prompt = f"""You are a senior software engineering interviewer providing feedback on a candidate's interview answer.

Question Type: {question_type}
Question: {question_text}

Candidate's Answer:
{answer_text}

Evaluate this answer and respond ONLY with a valid JSON object. No preamble, no markdown. Format:
{{
  "score": <integer 1-10>,
  "strengths": ["strength 1", "strength 2"],
  "gaps": ["gap 1", "gap 2"],
  "suggestion": "One concrete paragraph on how to improve this answer."
}}

Scoring guide:
- 1-3: Missing key elements, vague, or off-topic
- 4-6: Adequate but lacks specifics or structure
- 7-8: Good answer with clear structure and relevant details
- 9-10: Excellent — specific, structured, concise, compelling

For behavioral questions, evaluate use of STAR method (Situation, Task, Action, Result).
For technical questions, evaluate accuracy, depth, and clarity of explanation."""

    message = client.messages.create(
        model=MODEL,
        max_tokens=800,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = message.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    feedback = json.loads(raw)
    return feedback