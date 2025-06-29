const express = require('express');
const router = express.Router();
const pool = require('../db/connection.js');
const {logToClient} = require('../utils/logger')


router.get('/getTurma', (req, res) => {
    const query = "SELECT * FROM turma";
    pool.query(query, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(rows);
    });
})

router.post('/createTurma', async (req, res) => {
    const {Cod_Curso, Cod_AnoSemestre, Turma_Abv, AnoTurma} = req.body;
    const query = `INSERT INTO turma (Cod_Curso, Cod_AnoSemestre, Turma_Abv, AnoTurma) VALUES (?, ?, ?, ?)`;
    const values = [Cod_Curso, Cod_AnoSemestre, Turma_Abv, AnoTurma]
    pool.query(query, values, (err) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Internal server error' })
        } else {
            logToClient("info","Turma criada", `A turma ${Turma_Abv} do ${AnoTurma}º ano  do curso ${Cod_Curso} foir criada para o semestre ${Cod_AnoSemestre}.`)
            return res.status(200).json({ message: 'Turma criada com sucesso' })
        }
    })
})

router.post('/updateTurma', async (req, res) => {
    const {Cod_Turma, Cod_Curso, Cod_AnoSemestre, Turma_Abv, AnoTurma} = req.body;
    const query = `UPDATE turma SET Cod_Curso = ?, Cod_AnoSemestre = ?, Turma_Abv = ?, AnoTurma = ? WHERE Cod_Turma = ?`;
    const values = [Cod_Curso, Cod_AnoSemestre, Turma_Abv, AnoTurma, Cod_Turma]
    pool.query(query, values, (err) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Internal server error' })
        } else {
            logToClient("info","Turma editada", `A turma ${Cod_Turma} foi alterada`)
            return res.status(200).json({ message: 'Turma atualizada com sucesso' })
        }
    })
})

router.delete('/deleteTurma', async (req, res) => {
    const {Cod_Turma} = req.body;
    const query = `DELETE FROM turma WHERE Cod_Turma = ?`;
    const values = [Cod_Turma]
    pool.query(query, values, (err) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: 'Internal server error' })
        } else {
            logToClient("info","Turma Turma removida", `A turma ${Cod_Turma} foi removida`)
            return res.status(200).json({ message: 'Turma eliminada com sucesso' })
        }
    })
} )

module.exports = router
