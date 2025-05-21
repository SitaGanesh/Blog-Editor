# Imports Blueprint, jsonify, and request from Flask for routing and handling HTTP requests and responses.
from flask import Blueprint, jsonify, request
# Imports JWT functions to protect routes and get the current user identity.
from flask_jwt_extended import jwt_required, get_jwt_identity
# Imports User and Blog models from the current package.
from .models import User, Blog
# Imports the database instance from the current package.
from . import db
# Imports datetime for timestamp handling.
from datetime import datetime

# Creates a views blueprint with a root route that returns a simple "Hello! World" HTML message.
views = Blueprint('views', __name__)

@views.route('/')
def hello():
    return '<h1>Hello! World</h1>'

# Defines a protected POST route to create or update a blog draft.
@views.route('/api/blogs/save-draft', methods=['POST'])
@jwt_required()
def save_draft():
    # Retrieves the current user's ID from the JWT token.
    user_id = int(get_jwt_identity())    
    # Gets JSON data from the request.
    data = request.get_json()
    # Extracts title, content, tags, and sets default status to 'draft'.
    title = data.get('title', '')
    content = data.get('content', '')
    tags = data.get('tags', '')
    status = data.get('status', 'draft')

    # Returns an error if the title is missing.
    if not title:
        return jsonify({'error': 'Title is required'}), 400

    # Checks if a blog_id is provided to update an existing draft.
    blog_id = data.get('id')
    # Retrieves the draft by ID and user, returns error if not found or unauthorized.
    if blog_id:
        blog = Blog.query.filter_by(id=blog_id, user_id=user_id).first()
        if not blog:
            return jsonify({'error': 'Draft not found or you lack permission'}), 403
        # Adds and commits the new draft to the database.
        blog.title = title
        blog.content = content
        blog.tags = tags
        blog.status = status
        blog.updated_at = datetime.utcnow()
        db.session.commit()
        return jsonify({'message': 'Draft updated', 'blog': blog.id}), 200

    # Returns success message with the new draft ID.
    blog = Blog(title=title, content=content, tags=tags, user_id=user_id, status=status)
    db.session.add(blog)
    db.session.commit()
    return jsonify({'message': 'Draft saved', 'blog': blog.id}), 201

# Publish
# Defines a protected POST route to publish a blog post.
@views.route('/api/blogs/publish', methods=['POST'])
@jwt_required()
def publish_blog():
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        title = data.get('title', '')
        content = data.get('content', '')
        tags = data.get('tags', '')
        status = 'published'

        if not title or not content:
            return jsonify({'error': 'Title and content are required'}), 400

        blog_id = data.get('id')
        if blog_id:
            blog = Blog.query.filter_by(id=blog_id, user_id=user_id).first()
            if not blog:
                return jsonify({'error': 'Blog not found'}), 404
            blog.title = title
            blog.content = content
            blog.tags = tags
            blog.status = status
            blog.updated_at = datetime.utcnow()
            db.session.commit()
            return jsonify({'message': 'Blog updated and published', 'blog': blog.id}), 200
        else:
            blog = Blog(title=title, content=content, tags=tags, user_id=user_id, status=status)
            db.session.add(blog)
            db.session.commit()
            return jsonify({'message': 'Blog published', 'blog': blog.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to publish blog: {str(e)}'}), 500


# Get all blogs (including drafts) for the authenticated user.
@views.route('/api/blogs/my', methods=['GET'])
@jwt_required()
def get_my_blogs():
    # Retrieves current user ID from the JWT token.
    user_id = int(get_jwt_identity())
    # Queries all blogs authored by the user.
    blogs = Blog.query.filter_by(user_id=user_id).all()
    # Returns a list of the user's blogs as JSON.
    return jsonify([{
        'id': b.id,
        'title': b.title,
        'content': b.content,
        'tags': b.tags,
        'status': b.status,
        'created_at': b.created_at.isoformat(),
        'updated_at': b.updated_at.isoformat()
    } for b in blogs]), 200


# Read a single blog by ID, allowing optional JWT authentication.
@views.route('/api/blogs/<int:id>', methods=['GET'])
@jwt_required(optional=True)
def get_blog(id):
    user_id = get_jwt_identity()
    if user_id is not None:
        user_id = int(user_id)
    blog = Blog.query.get(id)
    if not blog:
        return jsonify({'error': 'Blog not found'}), 404
    if blog.status == 'draft':
        if user_id is None or blog.user_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
    return jsonify({
        'id': blog.id,
        'title': blog.title,
        'content': blog.content,
        'tags': blog.tags,
        'status': blog.status,
        'author': blog.user.username,
        'created_at': blog.created_at.isoformat(),
        'updated_at': blog.updated_at.isoformat()
    }), 200

# GET /api/blogs — list all published blogs
@views.route('/api/blogs', methods=['GET'])
def list_published_blogs():
    blogs = Blog.query.filter_by(status='published').all()
    return jsonify([{
        'id': b.id,
        'title': b.title,
        'content': b.content,
        'tags': b.tags,
        'status': b.status,
        'author': b.user.username,
        'created_at': b.created_at.isoformat(),
        'updated_at': b.updated_at.isoformat()
    } for b in blogs]), 200


# Delete
# Defines a protected DELETE route to delete a blog by its ID.
@views.route('/api/blogs/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_blog(id):
    # Retrieves the current user ID from the JWT token.
    user_id = int(get_jwt_identity())
    # Queries the blog by ID and user to ensure ownership.
    blog = Blog.query.filter_by(id=id, user_id=user_id).first()
    # Returns an error if the blog is not found.
    if not blog:
        return jsonify({'error': 'Blog not found'}), 404
    # Deletes the blog from the database.
    db.session.delete(blog)
    # Commits the deletion.
    db.session.commit()
    # Returns a success message confirming deletion.
    return jsonify({'message': 'Blog deleted'}), 200
