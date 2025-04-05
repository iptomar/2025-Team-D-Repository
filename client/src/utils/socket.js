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
socket.on("add-aula-response", (response) => {
    if (response.success) {
        console.log("✅ Aula added successfully:", response.data);
        // You might want to update your UI here
    } else {
        console.error("❌ Error adding aula:", response.error);
        alert("Erro ao adicionar aula: " + response.error);
    }
});
socket.on("remove-aula-error", (data) => {
    alert(data)
})

export default socket;