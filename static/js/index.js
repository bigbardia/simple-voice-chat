let username = "";
while (username === ""){
    username =  prompt("Enter a username : ");
    document.cookie = `username=${username}`;
}

const socketio = io({"transports" : ['websocket']});


socketio.on("user_joined", (data) => {
    let main_div = document.getElementById("users");
    main_div.innerHTML = "";

    for (const uuid in data){
        let username = data[uuid];

        let child_div = document.createElement("div");
        child_div.id = uuid;
        let h2 = document.createElement("h2");
        h2.innerText = `Username : ${username}`
        child_div.append(h2);
        main_div.append(child_div);
    }
})


socketio.on("user_left" , (data) => {

    let uuid = data["uuid"];
    let div = document.getElementById(uuid);
    div.remove();

})