# This file marks a directory as a Python package and can be used to initialize package-level variables or imports.

# importing necessary things

# flask class to run application backend
from flask import Flask
# Used for creating database
from flask_sqlalchemy import SQLAlchemy
# to enable Cross-Origin Resource Sharing for the Flask app
from flask_cors import CORS
# LoginManager to handle user sessions and UserMixin to add default user methods
from flask_login import LoginManager,UserMixin
# to work with file and directory paths
from os import path
# to handle JWT-based authentication in the Flask app
from flask_jwt_extended import JWTManager

# Initializing the SQLAlchemy database instance and sets the database filename.
db=SQLAlchemy()
DB_NAME='database.db'

# Defines a function to create the Flask app instance with the current module name.
def create_app():
    app=Flask(__name__)

    # Sets Flask app configurations for secret key, database URI, and JWT token settings.
    app.config['SECRET_KEY']='asecretkey'
    app.config['SQLALCHEMY_DATABASE_URI']=f'sqlite:///{DB_NAME}'
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
    
    # Initializes the SQLAlchemy database with the Flask app.
    db.init_app(app)
    # Enables CORS for requests 
    CORS(app,
     resources={r"/*": {"origins": "http://localhost:5173"}},
     supports_credentials=True,
     expose_headers=["Authorization"])
    # Sets up JWTManager for handling JWT authentication in the app.
    jwt = JWTManager(app)
    
    # Imports the views and auth blueprints from the current package
    from .views import views
    from .auth import auth
    
    # Registers the auth blueprint at /auth and the views blueprint at / routes.
    app.register_blueprint(auth,url_prefix='/auth')
    app.register_blueprint(views,url_prefix='/')
    
    # Imports the models schemas
    from .models import User,Blog
    
    # Initializes LoginManager, sets the login view to 'auth.login', and links it to the app.
    login_manager=LoginManager()
    login_manager.login_view='auth.login'
    login_manager.init_app(app)
    
    # Defines a user loader function to retrieve a user by ID for session management.
    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))
    
    # Calls the database creation function and returns the Flask app instance.
    create_database(app)
    return app

# Creates the database tables if the database file doesn’t exist, using the app context.
def create_database(app):
    if not path.exists('backend/server/'+DB_NAME):
        with app.app_context():
            db.create_all()
            print("Database created.")