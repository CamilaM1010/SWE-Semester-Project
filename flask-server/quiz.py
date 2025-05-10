from flask import Blueprint, request, jsonify 
from flask_login import login_required, current_user
from bson import ObjectId
from database import get_database
from dotenv import load_dotenv
import os
from openai import OpenAI
import datetime
import json
import re

#Defines API KEy to have access to AI Quiz Generation
load_dotenv()
client = OpenAI(api_key=os.getenv("OPEN_API_KEY"))

#Created quiz blueprint to route properly
quiz_bp = Blueprint("quiz", __name__)

db = get_database("Notes")
notes_collection = db["Individual Notes"]
quizzes_collection = db["Quizzes"]

#Route: Generating a quiz
@quiz_bp.route("/generate", methods=["POST"])
@login_required
def generate_quiz():
    data = request.json
    note_ids = data.get("note_ids", [])
    quiz_type = data.get("quiz_type", "multiple_choice")

    if not note_ids:
        return jsonify({"error": "No notes selected."}), 400

    #Gather content from user selected notes to generate quizzes
    combined_text = ""
    for nid in note_ids:
        try:
            note = notes_collection.find_one({
                "_id": ObjectId(nid),
                "user": current_user.get_id()
            })
            if note:
                combined_text += (
                    f"Title: {note.get('title', '')}\n"
                    f"Header: {note.get('header', '')}\n"
                    f"Notes: {note.get('notes', '')}\n"
                    f"Summary: {note.get('summary', '')}\n\n"
                )
        except Exception as e:
            print(f"Error processing note {nid}: {e}")

    if not combined_text.strip():
        return jsonify({"error": "No valid note content found"}), 400

    try:
        quiz = generate_ai_quiz(combined_text, quiz_type)
    except Exception as e:
        return jsonify({"error": f"AI generation failed: {str(e)}"}), 500    

    quiz_doc = {
        "user": current_user.get_id(),
        "note_ids": note_ids,
        "quiz_type": quiz_type,
        "questions": quiz["questions"],
        "created_at": datetime.datetime.utcnow()
    }

    #Pastes resulting quiz questions
    result = quizzes_collection.insert_one(quiz_doc)
    return jsonify({
        "quiz_id": str(result.inserted_id),
        "questions": quiz["questions"]
    }), 200

#Saving generated quizzes
@quiz_bp.route("/api/quizzes/save", methods=["POST"])
@login_required
def save_quiz():
    data = request.get_json()
    questions = data.get("questions", [])
    quiz_type = data.get("quiz_type", "multiple_choice")

    if not questions:
        return jsonify({ "error": "No quiz content to save." }), 400

    quiz_doc = {
        "user": current_user.get_id(),
        "quiz_type": quiz_type,
        "questions": questions,
        "timestamp": datetime.datetime.utcnow()
    }

    result = quizzes_collection.insert_one(quiz_doc)
    return jsonify({ "success": True, "quiz_id": str(result.inserted_id) }), 200


#AI Quiz Generator using OpenAI
def generate_ai_quiz(content, quiz_type):
    prompt = (
        f"Generate a {quiz_type.replace('_', ' ')} quiz based on the following Cornell-style notes. "
        f"Return ONLY the questions in JSON format. Do not explain anything.\n\n"
        f"{content.strip()}\n\n"
        f"Format the output as: "
    )

    if quiz_type == "multiple_choice":
        prompt += """
        {
          "questions": [
            {
              "question": "...",
              "options": ["...", "...", "...", "..."],
              "answer": "..."
            },
            ...
          ]
        }
        """
    elif quiz_type == "true_false":
        prompt += """
        {
          "questions": [
            {
              "question": "...",
              "answer": "True"
            },
            {
              "question": "...",
              "answer": "False"
            }
          ]
        }
        """
    elif quiz_type == "flashcards":
        prompt += """
        {
          "questions": [
            {
              "term": "...",
              "definition": "..."
            },
            ...
          ]
        }
        """
    else:
        raise ValueError("Unsupported quiz type")

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a quiz generator AI."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=800
    )

    text = response.choices[0].message.content
    json_text = re.search(r"\{.*\}", text, re.DOTALL)
    if json_text:
        return json.loads(json_text.group())
    else:
        raise ValueError("No JSON found in AI response")
