import os
from flask import Flask, request, jsonify, send_from_directory
from pymongo import MongoClient
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from dotenv import load_dotenv
from models import User
from database import get_database
from notes import notes_bp
import secrets
import datetime
from folders import folder_bp

load_dotenv()
app = Flask(__name__, static_folder='../client/build')
app.secret_key = os.getenv("FLASK_SECRET_KEY", secrets.token_hex(16)).encode()

# Enable CORS for development
CORS(app, supports_credentials=True)
CORS(notes_bp, supports_credentials=True)
CORS(folder_bp, supports_credentials=True)

login = LoginManager(app)
login.login_view = 'api_login'

app.register_blueprint(notes_bp, url_prefix='/api/notes')
app.register_blueprint(folder_bp, url_prefix='/api/folders')

@login.user_loader
def load_user(username):
    db = get_database("user_auth")
    users_collection = db["users"]
    try:
        return User(users_collection, username)
    except ValueError:
        return None

# API endpoints for the React frontend
@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    db = get_database("user_auth")
    users_collection = db["users"]

    try:
        found_user = User(users_collection, username)

        if found_user.check_password(password):
            login_user(found_user)
            return jsonify({
                'success': True,
                'user': {'username': found_user['username']}
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Invalid username or password'
            }), 401
    except ValueError:
        return jsonify({
            'success': False,
            'error': 'Invalid username or password'
        }), 401

@app.route('/api/register', methods=['POST'])
def api_register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    db = get_database("user_auth")
    users_collection = db["users"]
    
    # Check if username already exists
    existing_user = users_collection.find_one({"username": username})
    if existing_user:
        return jsonify({
            'success': False,
            'error': 'Username already exists'
        }), 400
    
    # Create the new user
    try:
        User.create_user(users_collection, username, password)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Registration error: {str(e)}'
        }), 500

@app.route('/api/reset-password', methods=['POST'])
def api_reset_password():
    data = request.get_json()
    username = data.get('username')
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')
    
    if new_password != confirm_password:
        return jsonify({
            'success': False,
            'error': 'Passwords do not match'
        }), 400
    
    db = get_database("user_auth")
    users_collection = db["users"]
    
    try:
        # Check if user exists
        existing_user = users_collection.find_one({"username": username})
        if not existing_user:
            return jsonify({
                'success': False,
                'error': 'Username not found'
            }), 404
        
        # Update password
        user = User(users_collection, username)
        user.set_password(new_password)
        
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Password reset error: {str(e)}'
        }), 500

@app.route('/api/logout', methods=['POST'])
@login_required
def api_logout():
    logout_user()
    return jsonify({'success': True})

@app.route('/api/check-auth', methods=['GET'])
def check_auth():
    if current_user.is_authenticated:
        return jsonify({
            'authenticated': True,
            'user': {'username': current_user['username']}
        })
    else:
        return jsonify({'authenticated': False}), 401

# Serve React app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)