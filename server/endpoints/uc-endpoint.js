const express = require('express')
const router = express.Router()
const pool = require('../db/connection.js')

//FUNCIONA
router.get('/getUC', async(req,res)=>{
    try{
        const page = parseInt(req.query.page) || 1 // Página atual
        const pageSize = parseInt(req.query.pageSize) || 10 // Itens por página
        const offset = (page - 1) * pageSize // offset
        const dataQuery = "SELECT * FROM uc LIMIT ? OFFSET ?"
        const [ucs] = await pool.promise().query(dataQuery,[pageSize,offset])
        const [countResult] = await pool.promise().query("SELECT COUNT(*) as total FROM uc")
        const total = countResult[0].total
        res.json({
            data: ucs,
            pagination:{
                page,
                pageSize,
                totalItems: total,
                totalPages: Math.ceil(total / pageSize)
            }
        })
    }catch(err){
        console.error("Erro na consulta à base de dados:",err)
        return res.status(500).json({error:"Consulta à base de dados falhou"})
    }
})


//FUNCIONA
router.post('/createUC',async(req,res)=>{
    const {Nome, Horas, Cod_Curso} = req.body
    // Validação dos dados
    if (!Nome || !Horas || !Cod_Curso) {
        return res.status(400).json({ error: 'Nome, horas e código do curso são obrigatórios' })
    }
    // Verificar se a UC já existe
    const [resultado] = await pool.promise().query(`SELECT * FROM uc WHERE Nome = ? and Horas = ? and Cod_Curso = ?`,[Nome, Horas, Cod_Curso])
    if(resultado.length > 0){
        return res.status(400).json({ error: 'Essa UC já existe' })
    }
    // Inserir nova UC
    const query = `INSERT INTO uc (Nome, Horas, Cod_Curso) VALUES (?,?,?)`
    const values = [Nome, Horas, Cod_Curso]
    pool.query(query,values,(err) => {
        if(err) {
            console.error(err)
            return res.status(500).json({error: 'Internal server error'})
        }
        return res.status(200).json({message: 'UC criada com sucesso'})
    })
})


//FUNCIONA
router.post('/updateUC', async(req,res)=>{
    const {Nome, Horas, Cod_Curso, Cod_Uc} = req.body
    // Validação dos dados
    if (!Nome || !Horas || !Cod_Curso || !Cod_Uc) {
        return res.status(400).json({ error: 'Nome, horas, código do curso e código da UC são obrigatórios' })
    }
    // Verificar se a UC já existe
    const [resultado] = await pool.promise().query(`SELECT * FROM uc WHERE Nome = ? and Horas = ? and Cod_Curso = ? and Cod_Uc = ?`,[Nome, Horas, Cod_Curso, Cod_Uc])
    if(resultado.length > 0){
        return res.status(400).json({ error: 'Essa UC já existe' })
    }

    // Atualizar UC
    const query = `UPDATE uc SET Nome = ?, Horas = ?, Cod_Curso = ? WHERE Cod_Uc = ?`
    const values = [Nome, Horas, Cod_Curso, Cod_Uc]
    pool.query(query,values,(err)=>{
        if(err){
            console.error(err)
            return res.status(500).json({error: 'Internal server error'})
        }
        return res.status(200).json({message: 'UC atualizada com sucesso'})
    })
})


//FUNCIONA
router.delete('/deleteUC', async(req,res)=>{
    const {Cod_Uc} = req.body
    // Validação dos dados
    if (!Cod_Uc) {
        return res.status(400).json({ error: 'Código da UC é obrigatório' })
    }
    // Verificar se a UC existe
    const [resultado] = await pool.promise().query(`SELECT * FROM uc WHERE Cod_Uc = ?`,[Cod_Uc])
    if(resultado.length === 0){
        return res.status(400).json({ error: 'Essa UC não existe' })
    }

    // Remover UC
    const query = `DELETE FROM uc WHERE Cod_Uc = ?`
    const values = [Cod_Uc]
    pool.query(query,values,(err)=>{
        if(err){
            console.error(err)
            return res.status(500).json({error: 'Internal server error, provavelmente a UC é referenciada em outra tabela'})
        }
        return res.status(200).json({message: 'UC removida com sucesso'})
    })
})


module.exports = router