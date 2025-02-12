from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from supabase import create_client, Client
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456789@db.ohyetjikesjqvyaxpifa.supabase.co:5432/postgres'

db.init_app(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)  # 直接存储密码

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

    return jsonify({'message': 'Login successful'})


with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5050)
