import os

from flask import Flask, request, send_from_directory, redirect, render_template
from pymongo import MongoClient
from flask_login import LoginManager, login_user, login_required, logout_user
from werkzeug.security import generate_password_hash
from dotenv import load_dotenv
from models import User

load_dotenv()
app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY").encode()

login = LoginManager(app)
login.login_view = 'login'

def get_database(dbname):
    CONNECTION_STRING = "mongodb://localhost:27017/"
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
        return send_from_directory("static", "login.html")

    elif request.method == 'POST':
        username = request.form['username']
        incoming_password = request.form['password']
        print(f"attempting to login as: {username}")
        print("password:", incoming_password)

        db = get_database("user_auth")
        users_collection = db["users"]

        try:
            found_user = User(users_collection, username)
            print("found user: ", found_user)

            if found_user.check_password(incoming_password):
                print("it matches!")
                login_user(found_user)
                print("we are in private")
                return redirect("/private")
            else:
                print("something didn't work")
                return "Invalid Username or Password"

        except ValueError:
            _ = generate_password_hash(incoming_password)
            print("value error")
            return "Invalid Username or Password"

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return send_from_directory("static", "register.html")
    
    elif request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        password_confirm = request.form['password_confirm']
        
        # Check if passwords match
        if password != password_confirm:
            return "Passwords do not match"
        
        db = get_database("user_auth")
        users_collection = db["users"]
        
        # Check if username already exists
        existing_user = users_collection.find_one({"username": username})
        if existing_user:
            return "Username already exists"
        
        # Create the new user
        try:
            User.create_user(users_collection, username, password)
            return redirect("/login")
        except Exception as e:
            return f"Registration error: {str(e)}"

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect("/login")

@app.route('/')
def index():
    return send_from_directory("static", "index.html")

@app.route('/private')
@login_required
def private_page():  # put application's code here
    return 'Private page that you must be logged in to see!!'

if __name__ == '__main__':
    app.run()