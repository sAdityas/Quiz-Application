from models.User import User, db
from app import app
import pandas as pd



with app.app_context():
    db.create_all()

    # Read users from Excel file
    df = pd.read_excel('users.xlsx')  # Make sure users.xlsx is in the same directory or provide full path
    users = []
    for _, row in df.iterrows():
        emp_number = str(row['EMP_NUMBER']).strip()
        emp_name = str(row['EMP_NAME']).strip()
        tclid = f"TCLP/{emp_number}"
        if emp_name == "Aditya Sarkale".upper():
            user = User(name=emp_name, score=2, tclid=tclid)
            users.append(user)
        else:
            user = User(name=emp_name, score=0, tclid=tclid)
            users.append(user)
    user = User(name="admin", score=100,tclid="Track@123")
    users.append(user)
    db.session.add_all(users)
    db.session.commit()
    print(f"Database seeded with {len(users)} users from Excel.")