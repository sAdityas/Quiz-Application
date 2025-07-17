from models.Qs import QuizQuestion, db
from models.Paper import Paper
from app import app

with app.app_context():
    # ✅ Step 1: Create or fetch the paper
    paper = Paper.query.filter_by(title='General Tech Quiz', paperId = 1).first()

    if not paper:
        db.session.add(paper)
        db.commit()

    # ✅ Step 2: Add questions with this paperId
    questions = [
        QuizQuestion(
            qs="What does 'HTTP' stand for?",
            options=["HyperText Transfer Protocol", "HighText Transfer Protocol", "HyperText Transmission Protocol", "HyperTool Transfer Protocol"],
            correct_option=0,
            paper_id=paper.paperId
        ),
        QuizQuestion(
            qs="Which language is primarily used for styling web pages?",
            options=["HTML", "Python", "CSS", "Java"],
            correct_option=2,
            paper_id=paper.paperId
        ),
        QuizQuestion(
            qs="Which company developed the Windows operating system?",
            options=["Apple", "IBM", "Microsoft", "Google"],
            correct_option=2,
            paper_id=paper.paperId
        ),
        QuizQuestion(
            qs="Which device is used to convert digital signals to analog and vice versa?",
            options=["Router", "Modem", "Switch", "Hub"],
            correct_option=1,
            paper_id=paper.paperId
        ),
        QuizQuestion(
            qs="What is the full form of CPU?",
            options=["Central Processing Unit", "Computer Processing Unit", "Central Programming Unit", "Central Performance Unit"],
            correct_option=0,
            paper_id=paper.paperId
        ),
        QuizQuestion(
            qs="Which database is relational?",
            options=["MongoDB", "Firebase", "MySQL", "Cassandra"],
            correct_option=2,
            paper_id=paper.paperId
        ),
        QuizQuestion(
            qs="Which of these is an open-source operating system?",
            options=["Windows", "Linux", "MacOS", "DOS"],
            correct_option=1,
            paper_id=paper.paperId
        ),
        QuizQuestion(
            qs="What does 'IP' stand for in 'IP address'?",
            options=["Internet Process", "Internal Protocol", "Internet Protocol", "Information Protocol"],
            correct_option=2,
            paper_id=paper.paperId
        ),
        QuizQuestion(
            qs="Which programming language is known for its use in data science and machine learning?",
            options=["C", "Python", "Java", "PHP"],
            correct_option=1,
            paper_id=paper.paperId
        ),
        QuizQuestion(
            qs="What is Git primarily used for?",
            options=["Bug tracking", "Version control", "Database management", "UI design"],
            correct_option=1,
            paper_id=paper.paperId
        )
    ]

    # ✅ Step 3: Insert all
    db.session.add_all(questions)
    db.session.commit()

    print(f"Database seeded with paper ID: {paper.paperId}")

#     from models.User import User, db
# from app import app
# import pandas as pd



# with app.app_context():
#     db.create_all()

#     # Read users from Excel file
#     df = pd.read_excel('users.xlsx')  # Make sure users.xlsx is in the same directory or provide full path
#     users = []
#     for _, row in df.iterrows():
#         emp_number = str(row['EMP_NUMBER']).strip()
#         emp_name = str(row['EMP_NAME']).strip()
#         tclid = f"TCLP/{emp_number}"
#         if emp_name == "Aditya Sarkale".upper():
#             user = User(name=emp_name, score=2, tclid=tclid)
#             users.append(user)
#         else:
#             user = User(name=emp_name, score=0, tclid=tclid)
#             users.append(user)
#     user = User(name="admin", score=100,tclid="Track@123")
#     users.append(user)
#     db.session.add_all(users)
#     db.session.commit()
#     print(f"Database seeded with {len(users)} users from Excel.")