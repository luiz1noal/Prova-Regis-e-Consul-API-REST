const fs = require('fs').promises
const express = require('express')
const app = express()
const PORT = 8000

app.use(express.json())

let idAtual = 1
let logs = []

let usuarios = [
    { id: 1, nome: 'João' },
    { id: 2, nome: 'Maria' }
];

app.post('/logs', async (req, res) => {
    const { id, nome } = req.body
    const data = new Date().toLocaleDateString('pt-BR')
    const newLog = { id: idAtual++, nome, data }
    logs.push(newLog)

    await fs.appendFile('logs.txt', `${JSON.stringify(newLog)}\n`);

    res.status(201).json(newLog)
})

app.get('/usuarios', (req, res) => {
    res.json(usuarios);
})

app.get('/usuarios/:id', (req, res) => {
    const usuario = usuarios.find(u => u.id == req.params.id);
    if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(usuario);
})

app.put('/usuarios/:id', (req, res) => {
    const usuario = usuarios.find(u => u.id == req.params.id);
    if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    const { nome } = req.body;
    usuario.nome = nome;

    res.json(usuario);
})

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})



/*
async function leArquivo() {
    try {
        const dados = await readFile('./logs.txt', 'utf-8')
    } catch (err) {
        console.log("Erro ao ler o arquivo!", err)
    }
    console.log(dados)
}

async function addLogs(id, data, nome) {
    try {
        const texto = JSON.stringify({
            id,
            data,
            nome
        })
        await fs.appendFile('logs.txt', texto + '\n', 'utf-8')
    } catch (err) {
        console.log("Erro ao adicionar o cliente!", err)
    }
}
*/
//leArquivo()
//addLogs()