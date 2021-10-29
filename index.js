const redux = require('redux')
const prompts = require('prompts')

//funcão criadora de ação
//nome e cpf serão capturados via prompt
const realizarVestibular = (nome, cpf) => {
    const entre6e10 = Math.random() <= 0.7
    const nota = entre6e10 ? 6 + Math.random() * 4 : Math.random() * 5
    //esse JSON é uma ação
    return {
        type: 'REALIZAR_VESTIBULAR',
        payload: {
            nome, cpf, nota
        }
    }
}

// essa função também é uma criadora de ação
const realizarMatricula = (cpf, status) => {
    //esse JSON que ela devolve é uma ação
    return {
        type: 'REALIZAR_MATRICULA',
        payload: {
            cpf, status
        }
    }
}

//essa função é um reducer
const historicoVestibularReducer = (historicoVestibularAtual = [], acao) => {
    if (acao.type === 'REALIZAR_VESTIBULAR') {
        return [...historicoVestibularAtual, acao.payload]
    }
    return historicoVestibularAtual
}

//essa função também um reducer
const historicoMatriculaReducer = (historicoMatriculasAtual = [], acao) => {
    if (acao.type === 'REALIZAR_MATRICULA'){
        return [...historicoMatriculasAtual, acao.payload]
    }
    return historicoMatriculasAtual
}