from sqlmodel import SQLModel
from .db import engine
from .models import User, Measurement

def init_db():
    SQLModel.metadata.create_all(engine)

if __name__ == "__main__":
    print("Creating database tables...")
    init_db()
    print("Done.")
