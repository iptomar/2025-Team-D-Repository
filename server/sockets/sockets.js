// imports
const { Server } = require('socket.io');
const axios = require('axios');

const getIDDocente = async (nome) => {
  try {
    const response = await axios.get('https://api.sheety.co/d66910fcece25a1e4931d8d893e4e5ac/dbproj/docente');
    const docente = response.data.docente.find(d => d.Nome === nome);
    return { id_docente: docente?.ID_Docente || 1 };
  } catch (error) {
    console.error("Error getting ID_Docente:", error);
    return { id_docente: 1 };
  }
};

const getCodEscola = async (abreviacao) => {
  try {
    const response = await axios.get('https://api.sheety.co/d66910fcece25a1e4931d8d893e4e5ac/dbproj/escola');
    const escola = response.data.escola.find(e => e.Abreviacao === abreviacao);
    return { cod_escola: escola?.Cod_Escola || 1 };
  } catch (error) {
    console.error("Error getting Cod_Escola:", error);
    return { cod_escola: 1 };
  }
};

const getCodCurso = async (nome) => {
  try {
    const response = await axios.get('https://api.sheety.co/d66910fcece25a1e4931d8d893e4e5ac/dbproj/curso');
    const curso = response.data.curso.find(c => c.Nome === nome);
    return { cod_curso: curso?.Cod_Curso || 1 };
  } catch (error) {
    console.error("Error getting Cod_Curso:", error);
    return { cod_curso: 1 };
  }
};

const setupSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // accepting requests from all origins for now 
    }
  });

  let schedule = [
    // initial schedule data...
    { id:1, day: "Monday", start: "10:00", end: "12:00", subject: "Math 101", location: "Room A1" },
    { id:2, day: "Monday", start: "13:00", end: "15:00", subject: "History 101", location: "Room A2" },
    { id:3, day: "Monday", start: "15:30", end: "17:00", subject: "Biology 101", location: "Room A3" },
    { id:4, day: "Tuesday", start: "09:00", end: "11:00", subject: "English 101", location: "Room B1" },
    { id:5, day: "Tuesday", start: "11:30", end: "13:00", subject: "Computer Science 101", location: "Room B2" },
    { id:6, day: "Tuesday", start: "15:30", end: "17:00", subject: "Music 101", location: "Room B4" },
    { id:7, day: "Wednesday", start: "10:00", end: "12:00", subject: "Physics 101", location: "Room C1" },
    { id:8, day: "Wednesday", start: "14:30", end: "16:00", subject: "Geography 101", location: "Room C3" },
    { id:9, day: "Thursday", start: "09:00", end: "11:00", subject: "Philosophy 101", location: "Room D1" },
    { id:10, day: "Thursday", start: "15:30", end: "17:00", subject: "Economics 101", location: "Room D4" },
    { id:11, day: "Friday", start: "09:00", end: "11:00", subject: "Statistics 101", location: "Room E1" },
    { id:12, day: "Saturday", start: "09:00", end: "11:00", subject: "Astronomy 101", location: "Room F1" },
    { id:13, day: "Saturday", start: "11:30", end: "13:00", subject: "Statistics 201", location: "Room F2" },
    { id:14, day: "Saturday", start: "13:30", end: "15:00", subject: "Philosophy 201", location: "Room F3" },
  ];

  io.on("connection", (socket) => {
    console.log(`New socket connection. Socket id: ${socket.id}`);
    socket.emit("connection-ack-alert", "Real-time connection established.");
    socket.emit("update-aulas", { newAulas: schedule });
    console.log("Data sent", schedule);

    // Listen for the add-data.novaAula event from the client
    socket.on("add-data.novaAula", async (data) => {
      try {
        console.log("📥 Received add-data.novaAula event:", data);
    
        if (!data) {
          throw new Error("Missing novaAula data");
        }
    
        // Use id_docente from novaAula as teacher name
        const idDocenteObj = await getIDDocente(data.docente);
        data.docente = idDocenteObj.docente;
    
        const codEscolaObj = await getCodEscola(data.escola);
        data.escola = codEscolaObj.escola;
    
        const codCursoObj = await getCodCurso(data.curso);
        data.curso = codCursoObj.curso;
    
    
        // Send to Sheety
        console.log("Sending to Sheety:", { aula:data.aula });
        const sheetyResponse = await axios.post(
          'https://api.sheety.co/d66910fcece25a1e4931d8d893e4e5ac/dbproj/aula',
          { aula:data.aula }
        );
    
        // Log the full response to check what we are getting
        console.log("Sheety response:", sheetyResponse);
    
        // Check if the response contains data.aula
        if (!sheetyResponse || !sheetyResponse.data || !sheetyResponse.data.aula) {
          console.error("❌ Sheety response format error:", sheetyResponse);
          throw new Error("Invalid Sheety response - missing aula data");
        }
    
        // If aula exists, proceed to get its ID
        const aulaId = sheetyResponse.data.aula.id;
        if (!aulaId) {
          console.error("❌ Missing aula id in Sheety response:", sheetyResponse);
          throw new Error("Missing aula ID in Sheety response");
        }
    
        // Update server schedule
        schedule.push(data);
    
        // Respond to client
        socket.emit("add-data.novaAula-response", {
          success: true,
          data: data
        });
    
        // Broadcast the update to all clients
        io.emit("update-aulas", { novaAula: schedule });
    
        console.log("✅ novaAula synced. Sheety ID:", aulaId);
      } catch (error) {
        console.error("❌ Error:", error.message, "Response:", error.response?.data);
        socket.emit("add-data.novaAula-error", error.message);
      }
    });
    
    
  });

  console.log("Socket.io server setup complete.");
};

module.exports = { setupSockets };
