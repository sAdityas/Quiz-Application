from backend.models.Paper import Paper, db
from app import app

with app.app_context():
 
    db.create_all()

    q1 = Paper(
        id=1,
        name="admin",
        passwd="admin123"  # index of "4" in name
    )
    q2 = Paper(
        id=2,
        name=admin1,
        passwd="Trackadmin123"  # index of "Paris" in name
    )
    q3 = Paper(
        id=3,
        name=["Python", "HTML", "C", "Java"],
        passwd=1  # index of "HTML" in options
    )

    db.session.add_all([q1, q2, q3])
    db.session.commit()
    print("Database seeded.")