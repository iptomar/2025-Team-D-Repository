// imports
import { io } from 'socket.io-client';

// socket connection
const socket = io('http://localhost:5170');

socket.on("connection-ack-alert", (data) => {
    alert(data)
})

socket.on("add-aula-error", (data) => {
    alert(data)
})

socket.on("remove-aula-error", (data) => {
    alert(data)
})

export default socket;