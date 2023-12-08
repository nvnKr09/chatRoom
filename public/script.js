var socket = io();  // this line is causing connection event on my server

// declaring a variable for storing username.
let userName = '';

const joinChatBtn = document.getElementById('join-chat');
const userNameInput = document.getElementById('username-input');
const loginForm = document.querySelector('.login-page');
const chatRoomContainer = document.querySelector('.chatroom-container');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('sendButton');
const exitBtn = document.getElementById('exitButton');
const messageContainer = document.querySelector('.message-container');

// join button functionality
joinChatBtn.addEventListener('click', (event)=>{
    event.preventDefault();
    userName = userNameInput.value;

    // Hides the form after a valid username and show chatRoom
    if (userName.trim() !== "") {
        loginForm.style.display = 'none';
        chatRoomContainer.style.display = 'block';
        userNameInput.value = "";

        // sending userName from client to server
        socket.emit('username enter', userName);
    } else {
        const alertBox = document.querySelector('.alert-box');
        alertBox.textContent = 'Enter a valid Username';

        // disappearing alert msg after 2sec
        setTimeout(() => {
            alertBox.textContent = '';
        }, 3000);
    }
});
// exit button functionality
exitBtn.addEventListener('click', (event) => {
    event.preventDefault();
    // sending username exit event to server.
    socket.emit('username exit', userName);
    
    // exiting from chat and rendering login page
    chatRoomContainer.style.display = 'none';
    loginForm.style.display = 'block';
    
    // after exiting empty all the messages.
    messageContainer.innerHTML = "";
});

// render Message function
function renderMessage(dataObj, typeOfMsg) {
    const msgDiv = document.createElement('div');
    const nameDiv = document.createElement('div');
    // only display recieved messages username
    if (typeOfMsg === "REC") {
        nameDiv.innerText = `~ ${dataObj.username}`;
    }
    // console.log(dataObj.username);

    // Adding classes to nameDiv according to send and recieve
    if (typeOfMsg === "SENT") {
        nameDiv.classList.add('you');
    } else {
        nameDiv.classList.add('sender-name');
    }
    const msgTextDiv = document.createElement('div');
    msgTextDiv.classList.add('msg-text');
    msgTextDiv.innerText = dataObj.message;

    // if message recieved then render name & message else only messsage.
    if (typeOfMsg === "REC") {
        msgDiv.append(nameDiv, msgTextDiv);
    } else {
        msgDiv.append(msgTextDiv);
    }
    // Adding classes to msgDiv according to send and recieve
    if (typeOfMsg === "SENT") {
        msgDiv.classList.add('message', 'sent');
    } else {
        msgDiv.classList.add('message');
    }
    messageContainer.append(msgDiv);
    messageInput.value = "";
    messageInput.focus();
}

// send button functionality
sendBtn.addEventListener("click", (e) =>{
    e.preventDefault();
    e.stopPropagation();
    // if messageInput is empty or having only spaces return.
    if (messageInput.value.trim() === "") {
        messageInput.style.border = '1px solid red';
        setTimeout(()=>{
            messageInput.style.border = '1px solid #bbbbbb';
        },2000);
        return;
    }
    let data = {
        id : socket.id,
        message: messageInput.value,
        username: userName
    };

    socket.emit('this is a msg event', data);

    renderMessage(data, 'SENT');
});

// recieving server data and rendering message.
socket.on('this is a msg event', (data) =>{
    // if sending device and recieving device is same
    // dont render the message.
    if (socket.id !== data.id && chatRoomContainer.style.display == 'block') {
        renderMessage(data, "REC");
    }
});

// render activity messages.
function renderActivityMsg(username, typeOfActivity) {
    const activityDiv = document.createElement('div');
    activityDiv.classList.add('activity');
    if (typeOfActivity === "JOIN") {
        activityDiv.innerHTML = `<b>${username}</b> has joined the Chatroom`;
    } else {
        activityDiv.innerHTML = `<b>${username}</b> left the Chatroom`;
    }
    messageContainer.append(activityDiv);
}

// recieving the 'join' activity data from server and rendering to client
socket.on('username enter', (data) =>{
    // if joining device device is same
    // don't render the message.
    if (data !== userName && chatRoomContainer.style.display == 'block') {
        renderActivityMsg(data, "JOIN");
    }
});
// recieving the 'exit' activity data from server and rendering to client
socket.on('username exit', (data) =>{
    // if joining device device is same
    // don't render the message.
    if (data !== userName && chatRoomContainer.style.display == 'block') {
        renderActivityMsg(data, "EXIT");
    }
});

