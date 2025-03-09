import os

from flask import Flask, request, send_from_directory, redirect, render_template, flash
from pymongo import MongoClient
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash
from dotenv import load_dotenv
from models import User
import secrets
import datetime

load_dotenv()
app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", secrets.token_hex(16)).encode()

login = LoginManager(app)
login.login_view = 'login'

def get_database(dbname):
    CONNECTION_STRING = "mongodb+srv://aydinoznil:2fMUpD87WDNctc@cluster0.6p2s0.mongodb.net/"
    client = MongoClient(CONNECTION_STRING)
    return client[dbname]

@login.user_loader
def load_user(username):
    db = get_database("user_auth")
    users_collection = db["users"]
    return User(users_collection, username)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template("login.html", error=None)

    elif request.method == 'POST':
        username = request.form['username']
        incoming_password = request.form['password']
        db = get_database("user_auth")
        users_collection = db["users"]

        try:
            found_user = User(users_collection, username)

            if found_user.check_password(incoming_password):
                login_user(found_user)
                return redirect("/private")
            else:
                return render_template("login.html", error="Invalid username or password")
        except ValueError:
            return render_template("login.html", error="Invalid username or password")

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template("register.html", error=None)
    
    elif request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        password_confirm = request.form['password_confirm']
        
        # Check if passwords match
        if password != password_confirm:
            return render_template("register.html", error="Passwords do not match")
        
        db = get_database("user_auth")
        users_collection = db["users"]
        
        # Check if username already exists
        existing_user = users_collection.find_one({"username": username})
        if existing_user:
            return render_template("register.html", error="Username already exists")
        
        # Create the new user
        try:
            User.create_user(users_collection, username, password)
            flash("Registration successful! Please log in.")
            return redirect("/login")
        except Exception as e:
            return render_template("register.html", error=f"Registration error: {str(e)}")

@app.route('/reset-password', methods=['GET', 'POST'])
def reset_password():
    if request.method == 'GET':
        return render_template("reset_password.html", error=None, success=None)
    
    elif request.method == 'POST':
        username = request.form['username']
        new_password = request.form['new_password']
        confirm_password = request.form['confirm_password']
        
        if new_password != confirm_password:
            return render_template("reset_password.html", error="Passwords do not match")
        
        db = get_database("user_auth")
        users_collection = db["users"]
        
        try:
            # Check if user exists
            existing_user = users_collection.find_one({"username": username})
            if not existing_user:
                return render_template("reset_password.html", error="Username not found")
            
            # Update password
            user = User(users_collection, username)
            user.set_password(new_password)
            
            flash("Password reset successful! Please log in with your new password.")
            return redirect("/login")
        except Exception as e:
            return render_template("reset_password.html", error=f"Password reset error: {str(e)}")

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect("/login")

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/private')
@login_required
def private_page():  # put application's code here
    return render_template("private.html", username=current_user["username"])

# Add template rendering for HTML files
def render_template(template_name, **context):
    with open(f"static/{template_name}", 'r', encoding='utf-8') as file:
        template_content = file.read()
        
    # Very simple template rendering for error messages
    for key, value in context.items():
        if value:
            placeholder = f"{{{{{key}}}}}"
            template_content = template_content.replace(placeholder, str(value))
            
            # If it's an error message, update the style to display it
            if key == "error" and value:
                template_content = template_content.replace('class="error-message" style="display: none"', 
                                                          'class="error-message" style="display: block"')
            # If it's a success message, update the style to display it
            elif key == "success" and value:
                template_content = template_content.replace('class="success-message" style="display: none"', 
                                                          'class="success-message" style="display: block"')
    
    return template_content

if __name__ == '__main__':
    app.run(debug=True)