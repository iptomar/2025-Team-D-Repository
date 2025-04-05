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
      return 1;
    }
  };
  
  const getCodEscola = async (abreviacao) => {
    try {
      const response = await axios.get('https://api.sheety.co/d66910fcece25a1e4931d8d893e4e5ac/dbproj/escola');
      const escola = response.data.escola.find(e => e.Abreviacao === abreviacao);
      return { cod_escola: escola?.Cod_Escola || 1 };
    } catch (error) {
      console.error("Error getting Cod_Escola:", error);
      return 1;
    }
  };
  
  const getCodCurso = async (nome) => {
    try {
      const response = await axios.get('https://api.sheety.co/d66910fcece25a1e4931d8d893e4e5ac/dbproj/curso');
      const curso = response.data.curso.find(c => c.Nome === nome);
      return { cod_curso: curso?.Cod_Curso || 1 };
    } catch (error) {
      console.error("Error getting Cod_Curso:", error);
      return 1;
    }
  };
const setupSockets = (server) => {
    const io = new Server(server,{
        cors: {
            origin: "*",                        // accepting requests from all origins for now 
        }
    })

    let schedule = [ // get initial data for DB
        // monday classes
        { id:1, day: "Monday", start: "10:00", end: "12:00", subject: "Math 101", location: "Room A1"}, 
        { id:2, day: "Monday", start: "13:00", end: "15:00", subject: "History 101", location: "Room A2" },
        { id:3, day: "Monday", start: "15:30", end: "17:00", subject: "Biology 101", location: "Room A3" },
        // tuesday classes
        { id:4, day: "Tuesday", start: "09:00", end: "11:00", subject: "English 101", location: "Room B1" },
        { id:5, day: "Tuesday", start: "11:30", end: "13:00", subject: "Computer Science 101", location: "Room B2" },
        { id:6, day: "Tuesday", start: "15:30", end: "17:00", subject: "Music 101", location: "Room B4" },
        // wednesday classes
        { id:7, day: "Wednesday", start: "10:00", end: "12:00", subject: "Physics 101", location: "Room C1" },
        { id:8, day: "Wednesday", start: "14:30", end: "16:00", subject: "Geography 101", location: "Room C3" },
        // thursday classes
        { id:9, day: "Thursday", start: "09:00", end: "11:00", subject: "Philosophy 101", location: "Room D1" },
        { id:10, day: "Thursday", start: "15:30", end: "17:00", subject: "Economics 101", location: "Room D4" },
        // friday classes
        { id:11, day: "Friday", start: "09:00", end: "11:00", subject: "Statistics 101", location: "Room E1" },
        // saturday classes
        { id:12, day: "Saturday", start: "09:00", end: "11:00", subject: "Astronomy 101", location: "Room F1" },
        { id:13, day: "Saturday", start: "11:30", end: "13:00", subject: "Statistics 201", location: "Room F2" },
        { id:14, day: "Saturday", start: "13:30", end: "15:00", subject: "Philosophy 201", location: "Room F3" },
      ];

    io.on("connection", (socket) => {
        // log new connection
        console.log(`New socket connection. Socket id: ${socket.id}`)

        // send connection ack to client
        socket.emit("connection-ack-alert", "Real-time connection established.")

        // send server aulas state to client
        socket.emit("update-aulas", { newAulas: schedule})
        console.log("Data sent", schedule)

        // Add a new aula to the server and Sheety
        socket.on("add-aula", async (data) => {
            try {
                console.log("📥 Received add-aula event:", data);
                
                // Validate data
                if (!data.newAula?.disciplina || !data.newAula?.sala || !data.newAula?.professor) {
                    throw new Error("Missing required fields");
                }
                const { id_docente } = await getIDDocente(data.newAula.professor);
                const { cod_escola } = await getCodEscola(data.newAula.escola);
                const { cod_curso } = await getCodCurso(data.newAula.curso);
                // Prepare Sheety data (WITHOUT ID)
                const sheetyData = {
                    aula: {
                        id_docente,  // Now properly defined
                        cod_sala: data.newAula.sala,
                        cod_turma: data.newAula.turma || "A",
                        cod_uc: data.newAula.disciplina,
                        cod_curso,  // Now properly defined
                        cod_anosemestre: data.newAula.ano || "1",
                        cod_escola,  // Now properly defined
                        id_tipologia: 1,
                        hora_de_inicio: data.newAula.start || "08:00",
                        hora_de_fim: data.newAula.end || "09:00",
                        duracao: data.newAula.duracao || "1h"
                    }
                };
        
                console.log("📝 Prepared Sheety data:", sheetyData);
        
                // Send to Sheety
                const sheetyResponse = await axios.post(
                    'https://api.sheety.co/d66910fcece25a1e4931d8d893e4e5ac/dbproj/aula',
                    sheetyData
                );
                
                // Verify response
                if (!sheetyResponse.data?.aula?.id) {
                    throw new Error("Invalid Sheety response - no ID returned");
                }
        
                // Create local record using SHEETY'S ID (not schedule.length)
                const addedAula = {
                    id: sheetyResponse.data.aula.id, // Use Sheety's ID!
                    day: data.newAula.day || "Monday",
                    start: sheetyData.aula.hora_de_inicio,
                    end: sheetyData.aula.hora_de_fim,
                    subject: data.newAula.disciplina,
                    location: data.newAula.sala,
                    ...data.newAula
                };
        
                // Update server state
                schedule.push(addedAula);
        
                // Respond to client
                socket.emit("add-aula-response", {
                    success: true,
                    data: sheetyData
                });
        
                // Broadcast update
                io.emit("update-aulas", { newAulas: schedule });
        
                console.log("✅ Aula synced. Sheety ID:", sheetyResponse.data.aula.id, 
                           "Local ID:", addedAula.id);
        
            } catch (error) {
                console.error("❌ Error:", error.message, 
                             "Response:", error.response?.data);
                socket.emit("add-aula-error", error.message);
            }
        });
        // Remove aula from the server and Sheety
        socket.on("remove-aula", (data) => {
            let aulaExists = schedule.some((aula) => aula.id === data.aulaId);
            if (aulaExists) {
                schedule = schedule.filter((aula) => aula.id !== data.aulaId);
                console.log("Aula removed: ", data.aulaId);

                // Broadcast the updated schedule to all connected clients
                io.emit("update-aulas", { newAulas: schedule });
            } else {
                console.log("Error removing aula: ", data.aulaId);
                socket.emit("remove-aula-error", "Esta aula não pode ser removida.");
            }
        });

    })


    // log setup
    console.log("Socket.io server setup complete. ")

}
// export
module.exports = { setupSockets }