const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: "localhost", // Pode ser diferente dependendo do seu servidor
    user: "root", // Usuário do seu banco
    password: "senha", // Senha do seu banco
    database: "escritor_db"
});

db.connect(err => {
    if (err) throw err;
    console.log("Conectado ao banco de dados!");
});

// Criar a tabela para armazenar os textos, caso não exista
db.query(
    `CREATE TABLE IF NOT EXISTS textos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        conteudo TEXT NOT NULL,
        adoro INT DEFAULT 0
    )`,
    (err, result) => {
        if (err) throw err;
        console.log("Tabela de textos criada ou já existe.");
    }
);

// Rota para pegar os textos
app.get("/textos", (req, res) => {
    db.query("SELECT * FROM textos", (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Rota para adicionar um novo texto
app.post("/textos", (req, res) => {
    const { titulo, conteudo } = req.body;
    db.query(
        "INSERT INTO textos (titulo, conteudo) VALUES (?, ?)",
        [titulo, conteudo],
        (err, result) => {
            if (err) throw err;
            res.status(201).json({ id: result.insertId, titulo, conteudo });
        }
    );
});

// Rota para atualizar a reação "Adoro!"
app.put("/textos/:id/adoro", (req, res) => {
    const { id } = req.params;
    const { adoro } = req.body;

    db.query(
        "UPDATE textos SET adoro = ? WHERE id = ?",
        [adoro, id],
        (err, result) => {
            if (err) throw err;
            res.json({ id, adoro });
        }
    );
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000.");
});
