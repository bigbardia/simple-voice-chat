from flask import Flask , render_template , request , session
from flask_socketio import SocketIO
from uuid import uuid4

app = Flask(__name__, template_folder="templates" , static_folder="static")
socketio = SocketIO(app , logger=True )
socketio.async_mode = "gevent"




clients = {}




@socketio.on("connect")
def user_connected():
    session["uuid"] = uuid4().hex
    session["username"] = request.cookies.get("username" , "shit")
    clients[session["uuid"]] = session["username"]
    socketio.emit("user_joined", clients , broadcast = True)



@socketio.on("disconnect")
def user_disconnected():
    clients.pop(session["uuid"])
    socketio.emit("user_left", {"uuid" : session["uuid"]} , broadcast = True)



@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__": 
    socketio.run(app , debug = True)
