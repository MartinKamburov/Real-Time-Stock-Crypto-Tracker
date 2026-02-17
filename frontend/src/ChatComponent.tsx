import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import React from "react";

const socket = new SockJS('http://localhost:8080/crypto-info');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function (){
  stompClient.subscribe("/topic/prices", function (message){
    const msg = JSON.parse(message.body);
    const li = document.createElement("li");
    li.appendChild(document.createTextNode("Here is the message from spring boot: " + msg.c));
    document.getElementById("messages")?.appendChild(li);
  })

});
 

function sendMessage() {
  // It's important to cast the HTMLElement to its type because otherwise 'value' property doesn't exist. 
  // Written like this because otherwise it will get messed up as a tsx component
  const content: string = (document.getElementById("message") as HTMLInputElement).value;
  const msg = { sender: "User", content: content };
  stompClient.send("/app/sendMessage", {}, JSON.stringify(msg));
  (document.getElementById("message") as HTMLInputElement).value = ""
}

const ChatComponent: React.FC = () => {
  return(
    
    <div>
      <h1 className="mb-4">Welcome to a simple version of the chat app.</h1>

      <input type="text" id="message" className="mb-4" placeholder="Type your message here..." />
      <button onClick={() => sendMessage()}>Send</button>

      <br/>

      <ul id="messages">
        Messages go here:
        
      </ul>
      
    </div>
  )
}

export default ChatComponent;