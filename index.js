const redux = require('redux')
const prompts = require('prompts')

//funcão criadora de ação
//nome e cpf serão capturados via prompt
const realizarVestibular = (nome, cpf) => {
    const entre6e10 = Math.random() <= 0.4
    const nota = entre6e10 ? 6 + Math.random() * 4 : Math.random() * 5
    console.log(nota)
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

const todosOsReducers = redux.combineReducers({
    historicoMatricula: historicoMatriculaReducer,
    historicoVestibular: historicoVestibularReducer
})

const store = redux.createStore(todosOsReducers)

const main = async () => {
    const menu = "1-Realizar vestibular\n2-Realizar matrícula\n3-Visualizar meu status\n4-Visualizar lista de aprovados\n0-Sair"
    let resposta
    do{
        resposta = await prompts({
            type: 'number',
            name: 'op',
            message: menu
        })
        try{
            switch (resposta.op){
                case 1:{
                    //resposta.nome
                    const { nome } = await prompts({
                        type: 'text',
                        name: 'nome',
                        message: 'Digite seu nome'
                    })
                    const { cpf } = await prompts({
                        type: 'text',
                        name: 'cpf',
                        message: 'Digite seu cpf'
                    })
                    const acao = realizarVestibular(nome, cpf)
                    store.dispatch(acao)
                    console.log("Prova realizada")
                    break;
                }
                case 2:{
                    const { cpf } = await prompts({
                        type: 'text',
                        name: 'cpf',
                        message: 'Digite seu cpf'
                    })
                    const aprovado = store.getState().historicoVestibular
                    .find(aluno => aluno.cpf === cpf && aluno.nota >= 6)
                    if (aprovado) {
                        store.dispatch(realizarMatricula(cpf, 'M'))
                        console.log ("OK, matriculado!")
                    }
                    else{
                        store.dispatch(realizarMatricula(cpf, 'NM'))
                        console.log("Infelizmente você não foi aprovado no vestibular ainda.")
                    }
                    break;
                }
                case 3:{
                    const { cpf } = await prompts({
                        type: 'text',
                        name: 'cpf',
                        message: 'Digite seu cpf'
                    })
                    const aluno = store.getState().historicoMatricula.find(aluno => aluno.cpf === cpf)
                    if (aluno) {
                        console.log(`Seu status é ${aluno.status}`)
                    }
                    else{
                        console.log("Seu nome não consta na lista de matrículas")
                    }
                    break;
                }
                case 4:{
                    const listaAprovados = store.getState().historicoVestibular
                    .filter(aluno => aluno.nota >= 6)
                    console.log(listaAprovados)
                    break;
                }
                case 0:
                    console.log("Até mais")
                    break;
                default:
                    console.log("Opção inválida")
            }
        }
        catch(err){
            console.log("Opção inválida")
        }
    }while (resposta.op !== 0)
}

main()