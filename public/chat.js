const socket = io();
const nickname = localStorage.getItem("nickname");

function sendMessage() {
  const input = document.getElementById("messageInput");
  const message = input.value;
  if (message.trim()) {
    socket.emit("chat message", { nickname, message });
    input.value = "";
  }
}

socket.on("chat message", function(data) {
  const messageBox = document.getElementById("messages");
  const div = document.createElement("div");
  div.innerHTML = "<strong>" + data.nickname + ":</strong> " + data.message;
  messageBox.appendChild(div);
  messageBox.scrollTop = messageBox.scrollHeight;
});
