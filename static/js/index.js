let username = "";
while (username === ""){
    username =  prompt("Enter a username : ");
    document.cookie = `username=${username}`;
}

const socketio = io({"transports" : ['websocket']});

let muted = false;


navigator.mediaDevices.getUserMedia({audio : true}).then(stream => {
    let mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    
    mediaRecorder.addEventListener("dataavailable" , event => {
        let fileReader = new FileReader();
        fileReader.readAsDataURL(event.data);
        fileReader.onloadend =(e) =>{
            if (!muted){
                socketio.emit("voice", e.target.result);
            }
        }
    });

    mediaRecorder.addEventListener("stop" , ()=>{
        mediaRecorder.start();
    })

    setInterval(()=>{
        mediaRecorder.stop();
    },100);

})



socketio.on("receive_voice" , (data) => {
    console.log(data);
    var audio = new Audio(data);
    audio.play();
})




socketio.on("user_update", (data) => {
    let main_div = document.getElementById("users");
    main_div.innerHTML = "";

    for (const uuid in data){
        let username = data[uuid][0];
        let is_mute = data[uuid][1];
        console.log(is_mute);
        let child_div = document.createElement("div");
        child_div.id = uuid;
        let h2 = document.createElement("h2");
        h2.innerText = `Username : ${username}`
        child_div.append(h2);
        let p = document.createElement("p");

        if (is_mute) {
            p.innerText = "muted"
        }
        child_div.append(p);
        main_div.append(child_div);
    }
})


socketio.on("user_left" , (data) => {

    let uuid = data["uuid"];
    let div = document.getElementById(uuid);
    div.remove();

})


let mute_btn = document.getElementById("mute");
mute_btn.addEventListener("click", ()=>{
    if (!muted) {
        muted = true;
        mute_btn.innerText = "unmute"
        socketio.emit("mute")
    }
    else if (muted) {
        muted = false;
        mute_btn.innerText = "mute"
        socketio.emit("unmute");
    }
    
})