from flask import Blueprint, request, jsonify 
from pymongo import MongoClient 
from bson import ObjectId 
from flask_login import login_required, current_user 
from database import get_database 
from flask_cors import cross_origin
import datetime

# Create Blueprint for notes 
folder_bp = Blueprint("folder", __name__) 

# Connect to MongoDB 
db = get_database("Notes") 
folder_collection = db["Folders"] 

#Have the notes collection
notes_collection = db["Individual Notes"]

# Create a folder
@folder_bp.route("/", methods=["POST"], strict_slashes=False)
@login_required
def create_folder():
    print("User authenticated:", current_user.is_authenticated)
    print("Current user:", current_user.get_id())

    data = request.get_json()
    name = data.get("name")
    description = data.get("description")
    if not name:
        return jsonify({"error": "Name is required"}), 400
    folder = {
        "user": current_user.get_id(),
        "name": name,
        "description": description,
        "notes": [],
        "created": datetime.datetime.utcnow(),
        "edited": datetime.datetime.utcnow()
    }

    inserted_folder = folder_collection.insert_one(folder)
    print("folder created")
    return jsonify({"message": "Folder created", "folder_id": str(inserted_folder.inserted_id)}), 201


# Get all folders for the logged-in user
@folder_bp.route("/", methods=["GET"])
@login_required
def get_folders():
    user_folders = list(folder_collection.find({"user": current_user.get_id()}))

    for folder in user_folders:
        folder["_id"] = str(folder["_id"])

    return jsonify(user_folders), 200

@folder_bp.route("/<folder_id>", methods=["GET"])
@login_required
def get_folder(folder_id):
    folder = folder_collection.find_one({"_id": ObjectId(folder_id), "user": current_user.get_id()})
    if not folder:
        return jsonify({"error": "Folder not found"}), 404

    folder["_id"] = str(folder["_id"])
    return jsonify(folder), 200

#Get all notes in a specific folder
@folder_bp.route("/<folder_id>/notes", methods=["GET"])
@login_required
def get_notes_in_folder(folder_id):
    user_notes = list(notes_collection.find({"user": current_user.get_id(), "folder_id": folder_id}))

    for note in user_notes:
        note["_id"] = str(note["_id"])

    return jsonify(user_notes), 200

#Move a note to a folder
@folder_bp.route("/<folder_id>/notes/<note_id>/move", methods=["PUT"])
@login_required
def move_note_to_folder(folder_id, note_id):
    note = notes_collection.find_one({"_id": ObjectId(note_id), "user": current_user.get_id()})
    folder = folder_collection.find_one({"_id": ObjectId(folder_id), "user": current_user.get_id()})
    if not folder:
        return jsonify({"error": "Folder not found"}), 404
    if not note:
        return jsonify({"error": "Note not found"}), 404
    
    notes_collection.update_one({"_id": ObjectId(note_id)}, {"$addToSet": {"folder_id": folder_id}})
    folder_collection.update_one({"_id": ObjectId(folder_id)}, {"$addToSet": {"notes": note_id}})

    return jsonify(success=True, message="Note moved to folder"), 200

@folder_bp.route("/notes/<note_id>", methods=["PUT"])
@login_required
def move_note_out_all_folder(note_id):
    note = notes_collection.find_one({"_id": ObjectId(note_id), "user": current_user.get_id()})
    if not note:
        return jsonify({"error": "Note not found"}), 404
    
    notes_collection.update_one({"_id": ObjectId(note_id)}, {"$set": {"folder_id": []}})
    folder_collection.update_many(
    {"notes": note_id},
    {"$pull": {"notes": note_id}}
    )
    return jsonify(success=True, message="Note moved out of all folders"), 200

@folder_bp.route("/<folder_id>/notes/<note_id>/remove", methods=["PUT"])
@login_required
def move_note_out_one_folder(folder_id, note_id):
    folder = folder_collection.find_one({"_id": ObjectId(folder_id), "user": current_user.get_id()})
    if not folder:
        return jsonify({"error": "Folder not found"}), 404
    
    note = notes_collection.find_one({"_id": ObjectId(note_id), "user": current_user.get_id()})
    if not note:
        return jsonify({"error": "Note not found"}), 404
    
    notes_collection.update_one({"_id": ObjectId(note_id)}, {"$pull": {"folder_id": folder_id}})
    folder_collection.update_one({"_id": ObjectId(folder_id)}, {"$pull": {"notes": note_id}})

    return jsonify(success=True, message="Note moved out of the folder"), 200

#Delete a folder
@folder_bp.route("/<folder_id>", methods=["DELETE"])
@login_required
def delete_folder(folder_id):
    folder = folder_collection.find_one({"_id": ObjectId(folder_id), "user": current_user.get_id()})
    if not folder:
        return jsonify({"error": "Folder not found"}), 404
    
    notes_collection.update_many({"folder_id": folder_id, "user": current_user.get_id()}, {"$pull": {"folder_id": folder_id}})
    folder_collection.delete_one({"_id": ObjectId(folder_id)})

    return jsonify(success=True, message="folder successfully deleted"), 200