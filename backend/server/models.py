# this is use to create database tables or the structure of the database

# Imports the database instance from the current package.
from . import db
# to add default user methods for Flask-Login.
from flask_login import UserMixin
# to handle date and time fields.
from datetime import datetime


# Defines a Blog model with fields for id, title, content, tags, status, timestamps, user relationship, and links each blog to a user.
class Blog(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Auto-incrementing ID
    title = db.Column(db.String(255), nullable=False)  # Use 'title', not 'subject'
    content = db.Column(db.Text, nullable=False)
    tags = db.Column(db.String(255))
    status = db.Column(db.String(20), default='published')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    user = db.relationship('User', backref='blogs')

# Defines a User model with id, username, unique email, password, and Flask-Login user methods.
class User(db.Model,UserMixin):
    id=db.Column(db.Integer,primary_key=True)
    username=db.Column(db.String(150),nullable=False)
    email=db.Column(db.String(150),unique=True,nullable=False)
    password=db.Column(db.String(256),nullable=False)