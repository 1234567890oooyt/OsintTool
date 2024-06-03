import json
import subprocess
import os
import glob

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_login import UserMixin
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "JKOPAd901u2ji12i3ud89uasoidjsl"
CORS(app)

client = MongoClient(
    "mongodb+srv://admin2:admin@cluster0.k4m6cvu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

db = client.TelegramPhoneChecker


class User(UserMixin):
    def __init__(self, username, password, history, nickHistory):
        self.username = username
        self.password = generate_password_hash(password)
        self.history = history
        self.nickHistory = nickHistory


@app.route('/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']
    user = db.users.find_one({'username': username})
    if user and check_password_hash(user['password'], password):
        return jsonify({"message": "Successfully"}), 200
    else:
        return jsonify({"error": "Invalid Username or Password"}), 401


@app.route('/register', methods=['POST'])
def register():
    username = request.json['username']
    password = request.json['password']
    if db.users.find_one({'username': username}):
        return jsonify({"error": 'Username already exists'}), 400
    else:
        db.users.insert_one(
            {'username': username, 'password': generate_password_hash(password), 'history': [], 'nickHistory': []})
        return jsonify({"message": 'Registration successful'}), 201


@app.route("/check", methods=['POST'])
def check():
    username = request.json["username"]
    user = db.users.find_one({"username": username})

    number = request.json["numbers"]
    result = subprocess.run(f"python telegram_phone_number_checker/main.py --phone-numbers {number}",
                            shell=True)
    if result.returncode == 0:
        with open("results.json", "r") as file:
            output = json.load(file)
            user['history'].append(output)
            db.users.update_one({"username": username}, {"$set": {"history": user['history']}})
            return jsonify({'message': 'Program started successfully', 'output': output}), 200
    else:
        return jsonify({'error': 'An error occurred'}), 400


@app.route("/logs", methods=['POST'])
def gettingUser():
    username = request.json["username"]
    user = db.users.find_one({"username": username})
    if user:
        return jsonify({"history": user["history"], "nickHistory": user['nickHistory']}), 200
    else:
        return jsonify({"error": "An error occurred"}), 400


@app.route("/nickname", methods=['POST'])
def getNickname():
    nickname = request.json["nickname"]
    username = request.json["username"]
    user = db.users.find_one({"username": username})
    result = subprocess.run(f"maigret {nickname} --html -J simple --self-check --timeout 5 --top-sites 100 --retries 0",
                            shell=True)
    if result.returncode == 0:
        dir_path = './reports'
        latest_html_file, latest_json_file = find_latest_files(dir_path)

        print(f"Latest: {latest_html_file}")
        print(f"Latest: {latest_json_file}")
        with open(f"./reports/{latest_json_file}", "r") as file:
            output = json.load(file)
            user['nickHistory'].append(output)
            db.users.update_one({"username": username}, {"$set": {"nickHistory": user['nickHistory']}})
        return send_file(f"./reports/{latest_html_file}", mimetype="text/html")


def find_latest_files(directory):
    html_files = glob.glob(os.path.join(directory, '*.html'))
    json_files = glob.glob(os.path.join(directory, '*.json'))

    latest_html_file = max(html_files, key=os.path.getmtime, default=None)
    latest_json_file = max(json_files, key=os.path.getmtime, default=None)

    return os.path.basename(latest_html_file), os.path.basename(latest_json_file)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
