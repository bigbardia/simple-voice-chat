from flask import Flask , render_template
from flask_socketio import SocketIO

app = Flask(__name__, template_folder="templates" , static_folder="static")
socketio = SocketIO(app , logger=True )
socketio.async_mode = "gevent"



@app.route("/")
def index():
    return render_template("index.html")




if __name__ == "__main__": 
    socketio.run(app , debug = True)

