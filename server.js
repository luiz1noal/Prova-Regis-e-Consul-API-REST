const fs = require('fs').promises
const express = require('express')
const app = express()
const PORT = 8000

app.use(express.json())

let idAtual = 1
let logs = []

async function carregarLogs() {
    try {
        const data = await fs.readFile('logs.txt', 'utf-8')
        logs = data.split('\n').filter(line => line).map(line => JSON.parse(line))
        if (logs.length > 0) {
            idAtual = Math.max(...logs.map(log => log.id)) + 1
        }
    } catch (err) {
        logs = []
    }
}

async function salvarLogs() {
    const data = logs.map(log => JSON.stringify(log)).join('\n')
    await fs.writeFile('logs.txt', data)
}

carregarLogs()

app.post('/logs', async (req, res) => {
    const { nome } = req.body
    const data = new Date().toLocaleDateString('pt-BR')
    const newLog = { id: idAtual++, nome, data }
    logs.push(newLog)

    await salvarLogs()

    res.status(201).json(newLog)
})

app.get('/usuarios', (req, res) => {
    res.json(logs)
})

app.get('/usuarios/:id', (req, res) => {
    const usuario = logs.find(u => u.id == req.params.id)
    if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado' })
    }
    res.json(usuario)
})

app.put('/usuarios/:id', async (req, res) => {
    const usuario = logs.find(u => u.id == req.params.id)
    if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado' })
    }
    const { nome } = req.body
    usuario.nome = nome

    await salvarLogs()

    res.json(usuario)
})

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
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