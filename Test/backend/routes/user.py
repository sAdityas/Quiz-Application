from flask import Blueprint, request, jsonify
from models.User import User, db

user = Blueprint('user',__name__)

@user.route('/', methods=["GET"])
def getUser():
    Users = User.query.all()
    return jsonify({"User" : [user.to_dict()for user in Users]})

@user.route('/add', methods=["GET"])
def submit_user():
    user = "admin"
    id =  "TCLP/TCL/P/" + "987"
    score = 100
    existing_user = User.query.filter_by(tclid=id).first()
    if  existing_user:
        return jsonify({"message": "User with this Id already exists"}), 409
    # user_to_delete = User.query.filter_by(name=user, tclid=id).first()
    # if user_to_delete:
    #     db.session.delete(user_to_delete)
    #     db.session.commit()
    new_user = User(name=user, tclid=id, score=score)
    db.session.delete(new_user)
    db.session.commit()

    return jsonify({"message": "User Saved", "User": new_user.to_dict()}), 201

@user.route('/login', methods=["POST"])
def login_user():
    data = request.get_json()
    user_input = data.get('user', '').strip()
    uid_input = data.get('Uid', '').strip()

    # Admin login shortcut
    if user_input.lower() == 'admin' and uid_input == 'Track@123':
        return jsonify({"message": "Admin login success"}), 200

    # Validate fields
    if not user_input or not uid_input:
        return jsonify({"message": "Missing Username or ID"}), 400

    # Normalize inputs
    user = user_input.upper()
    id = "TCLP/TCL/P/" + uid_input

    users = User.query.filter_by(name=user, tclid=id).first()
    if users:
        return jsonify({"message": "User found", "User": users.to_dict()}), 200
    else:
        return jsonify({"message": "User not found"}), 404

    
@user.route('/score',methods=["POST"])
def score():
    try:
        data = request.get_json()    
        user_id = data.get('user_id','').strip()  # Expecting user_id (tclid or similar) in the request
        score = data.get('score')
        if user_id:
            user = User.query.filter_by(tclid=user_id).first()
            if user:
                
                user.score = score
                db.session.commit()
                print(score)
                return jsonify({"Result": "Done Uploaded"})
            else:
                return jsonify({"Error": "User not found"}), 404
        else:
            return jsonify({"Error": "Missing user_id"}), 400
    except Exception as e:
        return jsonify({"Error":str(e)}), 500


@user.route('/getScore', methods=["GET"])
def get_user_score():
    name = request.args.get('name')
    uid = request.args.get('Uid')
    user = User.query.filter_by(name=name, tclid=f"TCLP/TCL/P/{uid}").first()
    if user:
        return jsonify(score=user.score)
    return jsonify(score=0)

@user.route("/resetScore" , methods=["POST"])
def resetScore():
    try:
        score = 0
        users = User.query.all()
        for user in users:
            user.score = score
        db.session.commit()
        User.score = score
        return jsonify({"complete":"Score Reset Complete"})
    except Exception as e:
        return jsonify({'error':str(e)})
