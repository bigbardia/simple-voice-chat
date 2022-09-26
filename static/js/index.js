let username = "";

while (username === ""){
    username =  prompt("Enter a username : ");
    document.cookie = `username=${username}`;
}

const socketio = io({"transports" : ['websocket']});

let muted = false;


navigator.mediaDevices.getUserMedia({audio : {"echoCancellation" : true , "noiseSuppression" : true}}).then(stream => {
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
    },500);

})


socketio.on("receive_voice" , (data) => {
    var audio = new Audio(data);
    audio.play();
})


socketio.on("user_update", (data) => {
    let main_div = document.getElementById("users");
    main_div.innerHTML = "";

    for (const uuid in data){
        let username = data[uuid][0];
        let is_mute = data[uuid][1];
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


socketio.on("show_image", (data) => {
    let main_div = document.getElementById("images");
    let img = document.createElement("img");
    img.src = data;
    img.classList.add("uploaded-image");
    main_div.append(img);

})


let upload_btn = document.getElementById("uploaded-file");
upload_btn.addEventListener("change", ()=>{
    
    let file = upload_btn.files[0];
    let extension = file.type.split("/")[0];

    if (extension === "image" && file.size <= 1024 * 1024 * 10 ) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            let base64String = reader.result;
            socketio.emit("upload_file", base64String)
            upload_btn.value = "";
        }
    }
});
