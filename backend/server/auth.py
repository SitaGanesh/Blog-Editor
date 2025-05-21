# this files deals with the authentication part of the application

# for routing and handling HTTP requests and responses.
from flask import Blueprint, request, jsonify
#  to create tokens, require authentication, and get the current user identity.
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
# for hashing and verifying passwords securely.
from flask_bcrypt import Bcrypt
# User model from the current package.
from .models import User
# database instance from the current package.
from . import db
# to set expiration times for tokens.
from datetime import timedelta

# Flask Blueprint named 'auth' and initializes Bcrypt for password hashing.
auth = Blueprint('auth', __name__)
bcrypt = Bcrypt()

# Defines a POST route /signup in the auth blueprint for user registration.
@auth.route('/signup', methods=['POST'])
def signup():
    # Extracts username, email, and password from the JSON request data.
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Checks for missing username, email, or password and returns an error if any are absent.
    if not username or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    # Checks if the email is already registered and returns an error if found.
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400

    # Hashes the password and creates a new User object with the provided data.
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, email=email, password=hashed_password)
    
    # Adds the new user to the database, commits the changes, creates a JWT token valid for 7 days, and returns success with the token and user info.
    try:
        db.session.add(new_user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(
            identity=str(new_user.id),
            expires_delta=timedelta(days=7)
        )
        
        return jsonify({
            "message": "Signup successful",
            "token": access_token,
            "user": {
                "id": new_user.id,
                "username": new_user.username,
                "email": new_user.email
            }
        }), 201
    # Rolls back the database on error and returns a registration failure message with the error details.
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500


# Defines a POST route /login in the auth blueprint for user authentication.
@auth.route('/login', methods=['POST'])
def login():
    # Extracts email, and password from the JSON request data.
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Checks if email or password is missing and returns an error if so.
    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400
    
    # Retrieves the user from the database matching the given email.
    user = User.query.filter_by(email=email).first()
    
    # Returns an error if the user with the given email is not found.
    if not user:
        return jsonify({"error": "User not found"}), 401
        
    # If the user exists and the password matches, creates a JWT token valid for 7 days.
    if user and bcrypt.check_password_hash(user.password, password):
        # Create access token
        access_token = create_access_token(
            identity=str(user.id),
            expires_delta=timedelta(days=7)
        )
        # Returns success with the token and user details.
        return jsonify({
            "message": "Login successful",
            "token": access_token,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        }), 200
    # Returns an error if the password is incorrect.
    return jsonify({"error": "Invalid credentials"}), 401

# Defines a protected GET route /user that requires JWT authentication.
@auth.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    # Gets the current user ID from the JWT token.
    user_id = int(get_jwt_identity())
    # Retrieves the user from the database by ID.
    user = User.query.get(user_id)
    
    # Returns an error if the user is not found.
    if not user:
        return jsonify({"error": "User not found"}), 404
    # Returns the user's ID, username, and email in JSON format on success.
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email
    }), 200