const msgInput = document.getElementById('chat');
const token = localStorage.getItem('token');

window.addEventListener("DOMContentLoaded", () => {
    setInterval(() => {
        axios.get(`http://localhost:3000/user/get-message`, {headers: {"Authorization":token}})
        .then((response) => {
            console.log(response);
            showMessage(response.data.allMessage, response.data.user);
        })
        .catch((err) => {console.log(err)});
    }, 1000)
})

function showMessage(message) {
    const username = localStorage.getItem('username')
    const parentitem = document.getElementById("listOfMessages");
    parentitem.innerHTML = "";
    const childitem = document.createElement("li");
    childitem.className = "list-group-item";
    childitem.textContent = username + " " + "Joined";
    parentitem.appendChild(childitem);
    for(let i = 0; i < message.length; i++) {
        const childitem = document.createElement("li");
        childitem.className = "list-group-item";
        childitem.textContent = message[i].username + " : " + message[i].message;
        parentitem.appendChild(childitem);
    }
}

document.getElementById("msgSent").onclick = async function(event) {
    event.preventDefault();
    const message = msgInput.value;
    const username = document.getElementById('username').value=localStorage.getItem('username')
    const inputData = {
        message,
        username,
    }
    console.log(inputData);
    await axios.post("http://localhost:3000/user/message", inputData, {headers: {"Authorization": token}})
    .then((response) => {
        console.log(response);
        console.log(response.data.user);
        localStorage.setItem('token', response.data.token);
        showMessage(response.data.newMessage, response.data.user);
    })
    .catch((err) => {
        console.log(err);
    })
    msgInput.value = '';
}

