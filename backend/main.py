# Imports the Flask app factory function from the server package.
from server import create_app
# Imports the database instance from the models module.
from server.models import db

# Creates a Flask app instance using the factory.
app = create_app()

# Runs database creation within the app context.
with app.app_context():
    db.create_all()

# Starts the Flask development server with debugging enabled.
if __name__ == '__main__':
    app.run(debug=True)
