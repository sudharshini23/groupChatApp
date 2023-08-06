const msgInput = document.getElementById('chat');
if (msgInput) {
    msgInput.value = '';
}
const token = localStorage.getItem('token');

window.addEventListener("DOMContentLoaded", () => {
    // setInterval(() => {
        let msg = JSON.parse(localStorage.getItem('message'));
        showMessage(msg);
        let msgid=0;
        if(msg.length==0){
            msgid=undefined;
        }else{
            msgid = msg[msg.length-1].id;
        } 
        axios.get(`http://localhost:3000/user/get-message/?messageid=${msgid}`, {headers: {"Authorization":token}})
        .then((response) => {
            console.log(response);
            // showMessage(response.data.allMessage, response.data.user.name);
            localStorage.setItem('message',JSON.stringify(response.data.allMessage));
        })
        .catch((err) => {console.log(err)});
    // }, 1000)
})

function showMessage(message) {
    // console.log(user);
    const username = localStorage.getItem('username')
    const parentitem = document.getElementById("listOfMessages");
    parentitem.innerHTML="";
    const childitem=document.createElement("li");
    childitem.className="list-group-item";
    childitem.textContent= username +" Joined";
    parentitem.appendChild(childitem);
    for(let i = 0; i < message.length; i++) {
        const childitem = document.createElement("li");
        childitem.className = "list-group-item";
        // childitem.textContent = message[i].userId + " : " + message[i].message;
        childitem.textContent = message[i].username + " : " + message[i].message;
        parentitem.appendChild(childitem);
    }
}

document.getElementById("msgSent").onclick = async function(event) {
    event.preventDefault();
    const message = msgInput.value;
    // const username = token.name;
    const username =localStorage.getItem('username')
    console.log(username);
    // const username = token.name;
    const inputData = {
        message,
        username,
    }
    console.log(inputData);
    console.log("token front", token);
    await axios.post("http://localhost:3000/user/message", inputData, {headers: {"Authorization": token}})
    .then((response) => {
        console.log(response);
        localStorage.setItem('token', response.data.token);
        // showMessage(response.data.newMessage);
    })
    .catch((err) => {
        console.log(err);
    })
    msgInput.value = '';
}