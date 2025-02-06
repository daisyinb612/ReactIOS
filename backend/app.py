from flask import Flask, request, jsonify
from supabase import create_client, Client

app = Flask(__name__)

# 直接替换为你的Supabase URL和Key
url: str = "https://ohyetjikesjqvyaxpifa.supabase.co"  # 替换为你的实际Supabase URL
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oeWV0amlrZXNqcXZ5YXhwaWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1NzA0MzIsImV4cCI6MjA1NDE0NjQzMn0.m4DJgrs4ES6UMHY8z5XOspOsXZF6UPlxfTeMOC5p358"  # 替换为你的实际Supabase Key
supabase: Client = create_client(url, key)

@app.route('/auth/register', methods=['POST'])
def register():
    data = request.json
    response = supabase.auth.sign_up({
        'email': data['username'],
        'password': data['password']
    })
    if response.get('error'):
        return jsonify({'message': 'Registration failed'}), 400
    return jsonify({'message': 'User registered successfully'})

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    response = supabase.auth.sign_in_with_password({
        'email': data['username'],
        'password': data['password']
    })
    if response.get('error'):
        return jsonify({'message': 'Invalid credentials'}), 401
    return jsonify({'message': 'Login successful'})

if __name__ == '__main__':
    app.run(debug=True)
