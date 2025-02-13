from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime 
from flask_sqlalchemy import SQLAlchemy
from supabase import create_client, Client
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()
app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456789@db.ohyetjikesjqvyaxpifa.supabase.co:5432/postgres'

db.init_app(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)  # 直接存储密码

class Notes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


@app.route('/auth/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 400

    new_user = User(email=data['email'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'})

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user is None or user.password != data['password']:
        return jsonify({'message': 'Invalid credentials'}), 401

    print(f"UserID is : {user.id}")         
    return jsonify({'message': 'Login successful', 'id': user.id})  # Include user ID in the response

@app.route('/notes', methods=['GET'])
def fetch_notes():
    user_id = request.args.get('user_id')  
    print(f"Fetching notes for user_id: {user_id}") 
    notes = Notes.query.filter_by(user_id=user_id).all()  
    return jsonify([{'id': note.id, 'title': note.title, 'content': note.content} for note in notes])

@app.route('/addnotes', methods=['POST'])
def add_note():
    data = request.json
    new_note = Notes(user_id=data['user_id'], title=data['title'], content=data['content'])
    db.session.add(new_note)
    db.session.commit()
    return jsonify({'message': 'Note added successfully', 'note': {'id': new_note.id, 'title': new_note.title, 'content': new_note.content}})

@app.route('/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    note = Notes.query.get(note_id)
    if note is None:
        return jsonify({'message': 'Note not found'}), 404
    db.session.delete(note)
    db.session.commit()
    return jsonify({'message': 'Note deleted successfully'})

@app.route('/notes/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    data = request.json
    note = Notes.query.get(note_id)
    if note is None:
        return jsonify({'message': 'Note not found'}), 404
    
    note.title = data.get('title', note.title)  # Update the title of the note if provided
    note.content = data['content']  # Update the content of the note
    db.session.commit()
    return jsonify({'message': 'Note updated successfully', 'note': {'id': note.id, 'title': note.title, 'content': note.content}})


with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5050)
