from flask import Blueprint, request, jsonify 
from pymongo import MongoClient 
from bson import ObjectId 
from flask_login import login_required, current_user 
from database import get_database 
from flask_cors import cross_origin

# Create Blueprint for notes 
notes_bp = Blueprint("notes", __name__) 

# Connect to MongoDB 
db = get_database("Notes") 
notes_collection = db["Individual Notes"] 

# Create a note 
@notes_bp.route("/", methods=["POST"], strict_slashes=False) 
@login_required 
def create_note(): 
    print("User authenticated:", current_user.is_authenticated) 
    print("Current user:", current_user.get_id()) 

    data = request.json 
    print("Received data:", data)  # Debugging
    title = data.get("title") 
    content = data.get("content") 

    if not title: 
        return jsonify({"error": "Title is required"}), 400 

    note = { 
        "user": current_user.get_id(), 
        "title": title, 
        "content": content 
    } 
 

    inserted_note = notes_collection.insert_one(note) 
    print("note created") 
    return jsonify({"message": "Note created", "note_id": str(inserted_note.inserted_id)}), 201 


# Get all notes for the logged-in user 
@notes_bp.route("/", methods=["GET"]) 
@login_required 
def get_notes(): 
    user_notes = list(notes_collection.find({"user": current_user.get_id()})) 

    for note in user_notes: 
        note["_id"] = str(note["_id"]) 

    return jsonify(user_notes), 200 


# Get a single note 
@notes_bp.route("/<note_id>", methods=["GET"]) #not implemented yet, for searching notes
@login_required 
def get_note(note_id): 
    note = notes_collection.find_one({"_id": ObjectId(note_id), "user": current_user.get_id()}) 

    if not note: 
        return jsonify({"error": "Note not found"}), 404 

    note["_id"] = str(note["_id"]) 

    return jsonify(note), 200 

 
# Update a note 
@notes_bp.route("/<note_id>", methods=["PUT"], strict_slashes=False) 
@login_required 
def update_note(note_id): 
    print(f"Received update request for note_id: {note_id}")  # Debugging line

    try:
        data = request.json

        updated_note = notes_collection.find_one_and_update(
            {"_id": ObjectId(note_id)}, 
            {"$set": {"title": data.get("title"), "content": data.get("content")}}, 
            return_document=True
        )

        if not updated_note:
            print("Note not found in DB")  # Debugging line
            return jsonify({"error": "Note not found or unauthorized"}), 404 

        # Convert ObjectId to string before returning
        updated_note["_id"] = str(updated_note["_id"])

        return jsonify(updated_note), 200 

    except Exception as e:
        print("Error:", str(e))  # Debugging line
        return jsonify({"error": str(e)}), 500

 
# Delete a note 
@notes_bp.route("/<note_id>", methods=["DELETE"]) 
@login_required 
def delete_note(note_id): 
    print(f"Received DELETE request for note_id: {note_id}")
    try:
        result = notes_collection.delete_one({"_id": ObjectId(note_id), "user": current_user.get_id()})

        if result.deleted_count == 0:
            return jsonify({"error": "Note not found or unauthorized"}), 404

        return jsonify({"message": "Note deleted"}), 200
    except Exception as e:
        print(f"Error deleting note: {str(e)}")  # Print the exact error
        return jsonify({"error": "Internal Server Error"}), 500