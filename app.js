const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

const dbUsuarios = require('./db/usuarios.json')
const dbPets = require('./db/pets.json')


const PORT = process.env.PORT || 8877


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.append('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    next();
});



app.post('/login', (req, res) => {
    let credenciais = {
        "email": `${req.body.email}`,
        "senha": `${req.body.senha}`,
    }

    if (!findUserByEmail(credenciais.email)) {
        res.json({
            "status": "Usuário não encontrado!"
        })
        return
    }

    const usuario = findUserByEmail(credenciais.email)

    if (tryLogin(usuario, credenciais.senha)) {
        res.json({
            "status": "LOGADO",
            "usuario": `${usuario.nome}`,
            "id": `${usuario.id}`
        })
    } else {
        res.json({
            "status": "Senha incorreta, tente novamente!"
        })
    }

})

app.post('/usuarioDados', (req, res) => {
    console.log('acesso /usuariosDados')
    let id = req.body.id
    let usuario = findUserByID(id)
    let dadosUsuario = {
        "id": `${usuario.id}`,
        "nome": `${usuario.nome}`,
        "email": `${usuario.email}`,
        "telefone": `${usuario.telefone}`,
        "cidade": `${usuario.cidade}`,
        "sobre": `${usuario.sobre}`,
        "foto_perfil": `${usuario.foto_perfil}`
    }


    res.json(dadosUsuario)
})

app.post('/cadastro', (req, res) => {
    console.log('acesso /cadastro')
    let id = dbUsuarios.length + 1
    let novoUsuario = {
        "id": `${id}`,
        "nome": `${req.body.nome}`,
        "email": `${req.body.email}`,
        "telefone": `${req.body.telefone}`,
        "cidade": `${req.body.cidade}`,
        "sobre": `${req.body.sobre}`,
        "foto_perfil": `${req.body.foto_perfil}`
    }
    dbUsuarios.push(novoUsuario)
    
    fs.writeFileSync( './db/usuarios.json', JSON.stringify(dbUsuarios));
    res.json('Sucesso')
})

app.patch('/editaUsuario', (req, res) => {
    console.log('acesso /editaUsuario')
    let index = req.body.id - 1
    console.log(index)
    console.log(dbUsuarios[index])
    dbUsuarios[index].nome = req.body.nome
    dbUsuarios[index].telefone = req.body.telefone
    dbUsuarios[index].cidade = req.body.cidade
    dbUsuarios[index].sobre = req.body.sobre
    dbUsuarios[index].foto_perfil = req.body.foto_perfil
    
    fs.writeFileSync( './db/usuarios.json', JSON.stringify(dbUsuarios));
    console.log(dbUsuarios[index])
    res.json('Sucesso')

})


app.get('/pets', (req, res) => {
    console.log('acesso /pets')
    res.json(dbPets)
})

app.listen(PORT, () => {
    console.log('Escutando na porta: ' + PORT)
})
//install nodemon
//terminal - node app -> nodemon app


function findUserByEmail(email) {
    let usuario = dbUsuarios.find(element => element.email == email)
    return usuario
}

function findUserByID(id) {
    let usuario = dbUsuarios.find(element => element.id == id)
    return usuario
}

function tryLogin(usuario, senha) {
    if (usuario.senha == senha) {
        return true
    }
}

