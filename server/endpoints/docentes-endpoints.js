const express = require('express')
const router = express.Router()
const pool = require('../db/connection.js')

//FUNCIONA - Com Paginação
router.get('/getDocente', async (req, res) => {
    try {
        

        const page = parseInt(req.query.page) || 1; // Página atual 
        const pageSize = parseInt(req.query.pageSize) || 10; // Itens por página 
        const offset = (page - 1) * pageSize; // offset 
        
        
        const dataQuery = "SELECT * FROM docente LIMIT ? OFFSET ?";
        const [docentes] = await pool.promise().query(dataQuery, [pageSize, offset]);
        
        
        const [countResult] = await pool.promise().query("SELECT COUNT(*) as total FROM docente");
        const total = countResult[0].total;
        
        // Retornar dados e metadados de paginação
        res.json({
            data: docentes,
            pagination: {
                page,
                pageSize,
                totalItems: total,
                totalPages: Math.ceil(total / pageSize)
            }
        });
    } catch (err) {
        console.error("Erro na consulta à base de dados:", err);
        return res.status(500).json({ error: "Consulta à base de dados falhou" });
    }
});

//FUNCIONA
router.post('/createDocente', async (req, res) => {
    const { nome, email, password } = req.body;

    // Validação de dados
    if (!nome || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e password são obrigatórios' });
    }

    try {
        // Verificar se o docente já existe
        const [resultado] = await pool.promise().query(
            `SELECT * FROM docente WHERE Nome = ? and Email = ? and Password = ?`,
            [nome, email, password]
        );
        if (resultado.length > 0) {
            return res.status(400).json({ error: 'Esse docente já existe' });
        }

        // Inserir novo docente
        const query = `INSERT INTO docente (Nome, Email, Password) VALUES (?, ?, ?)`;
        const values = [nome, email, password];
        await pool.promise().query(query, values);

        return res.status(200).json({ message: 'Docente criado com sucesso' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


//FUNCIONA
router.post('/updateDocente', async(req,res)=>{
    const {cod_docente,nome,email,password} = req.body

    // Validação de dados
    if (!nome || !email || !password || !cod_docente) {
        return res.status(400).json({ error: 'Nome, email, password e código do docente são obrigatórios' })
    }

    // Verificar se o docente já existe
    const [resultado] = await pool.promise().query(`SELECT * FROM docente WHERE Nome = ? and Email = ? and Password = ? and Cod_Docente = ?`,[nome, email, password, cod_docente])
    if(resultado.length > 0){
        return res.status(400).json({ error: 'Esse docente já existe' })
    }

    const query = `UPDATE docente SET Nome = ?, Email = ?, Password = ? WHERE Cod_Docente = ?`
    const values = [nome,email,password,cod_docente]
    pool.query(query,values,(err)=>{
        if(err){
            console.error(err)
            return res.status(500).json({error: 'Internal server error'})
        
        }
        return res.status(200).json({message: 'Docente atualizado com sucesso'})
    })

})


//FUNCIONA
router.delete('/deleteDocente',(req,res)=>{
    const {cod_docente} = req.body
    const query = `DELETE FROM docente WHERE Cod_Docente = ?`
    const values = [cod_docente]
    pool.query(query,values, (err)=>{
        if(err){
            console.error(err)
            return res.status(500).json({error: 'Internal server error'})
        }
        return res.status(200).json({message: 'Docente eliminado com sucesso'})
        
    })
})

module.exports = router