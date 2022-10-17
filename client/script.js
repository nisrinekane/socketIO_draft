//to call an individual socket
import { io } from 'socket.io-client'

const joinRoomButton = document.getElementById("room-button")
const messageInput = document.getElementById("message-input")
const roomInput = document.getElementById("room-input")
const form = document.getElementById("form")

// connect one socket to url server (set up a connection to the client)
const socket = io('http://localhost:3000')
const userSocket = io('http://localhost:3000/user', { auth: { token: 'Test' }})

//listen to any events (including custom events) coming from the server
socket.on('connect', () => {
  displayMessage(`you connected with id: ${socket.id}`)
})


socket.on('receive-message', message => {
  displayMessage(message)
})


form.addEventListener("submit", e => {
    e.preventDefault()
    const message = messageInput.value;
    const room = roomInput.value;

    if (message === "") return displayMessage(message)
    // send events from the client to the server
    socket.emit('send-message', message, room)
    messageInput.value = ""
})

joinRoomButton.addEventListener("click", () => {
  const room = roomInput.value;
  socket.emit('join-room', room, message => {
    displayMessage(message)
  })
})

function displayMessage(message) {
  const div = document.createElement("div")
  div.textContent = message
  document.getElementById("message-container").append(div)
}