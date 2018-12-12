window.addEventListener("keydown", function (event) {
    console.log(event);
    //Botão Nova Tarefa
    if (event.altKey && event.keyCode == 78) {
        $('#modal').modal('show');
        document.querySelector('#btn-inserir').classList.remove('nao-mostrar');
        document.querySelector('#btn-alterar').classList.add('nao-mostrar');
        document.querySelector('#btn-deletar').classList.add('nao-mostrar');
        document.querySelector('.modal-title').innerHTML = "Inserir nova tarefa";

        // Setando o focus no campo descricao tarefa
        document.querySelector('#descricao-tarefa').focus();

        //Limpando os campos do formulário
        document.querySelector('#descricao-tarefa').value = '';
        document.querySelector('#data-tarefa').value = '';

        event.preventDefault();
    }
    //Botão Atabalho Inserir
    if (event.altKey && event.keyCode == 83) {
        inserir();
    }

    //Botão Atabalho Excluir
    if (event.altKey && event.keyCode == 82) {
        let promise = deletarTarefa(tarefa.id);
        promise
            .then(function (resolve) {
                mostrarMensagem("Tarefa Deletada com Sucesso", 's');
                montarPainel();
            })

            .catch(function (erro) {
                mostrarMensagem(erro, 'd');
            });
        $('#modal').modal('toggle');
    }

    //Botão Atalho Alterar
    if (event.altKey && event.keyCode == 65) {
        event.preventDefault();

        tarefa.descricao = document.querySelector('#descricao-tarefa').value;
        tarefa.data = document.querySelector('#data-tarefa').value;
      
        let promisse = alterarTarefa(tarefa);
        promisse
          .then(function (resolve) {
      
            montarPainel();
            mostrarMensagem('Tarefa alterada com sucesso!', 's');
          })
          .catch(function (erro) {
            mostrarMensagem(erro, 'd');
          });
      
        // Fechar o formulário
        $('#modal').modal('toggle');
      

    }

    //ABRIR FORMULARIO COM DADOS A VENCER
    for(let i = 112, j=1; i <= 113; i++, j++) {
        if (event.ctrlKey && event.keyCode == i) {
            getNext(j) 
        }

    }
    if (event.ctrlKey && event.keyCode == 114) {
        getPrev()
    }
});

//Botão tarefa preste a vencer 
function getNext(numero) {
    let dataHoje = new Date();

    listarTarefas("").then(data => {
        if (Array.isArray(data)) {
            dataHoje.setHours(-1)

            const novo = data.filter(d => {
                if (new Date(d.data) >= dataHoje) {
                    return d;
                }
            })

            if (novo.length < 1) {
                mostrarMensagem('Não existe tarefas prestes a vencer', 's');
                return null;
            }

            novo.sort((ant, dep) => {
                return ant >= dep
            });

            $('#modal').modal('show');
            document.querySelector('#btn-inserir').classList.add('nao-mostrar');
            document.querySelector('#btn-alterar').classList.remove('nao-mostrar');
            document.querySelector('#btn-deletar').classList.remove('nao-mostrar');
            document.querySelector('.modal-title').innerHTML = 'Alterar tarefa';

            // Setando o focus no campo descricao tarefa
            document.querySelector('#descricao-tarefa').focus();

            //Limpando os campos do formulário
            tarefa.id = novo[novo.length - numero].id;
            document.querySelector('#descricao-tarefa').value = novo[novo.length - numero].descricao;
            document.querySelector('#data-tarefa').value = dataToInput(novo[novo.length - numero].data);
        }

    }).catch(err => console.log(err))
}
//Vencido
function getPrev() {
    let dataHoje = new Date();

    listarTarefas("").then(data => {
        if (Array.isArray(data)) {
            dataHoje.setHours(-1)

            const novo = data.filter(d => {
                if (new Date(d.data) < dataHoje) {
                    return d;
                }
            })

            if (novo.length < 1) {
                mostrarMensagem('Não existe tarefas prestes a vencer', 's');
                return null;
            }

            novo.sort((ant, dep) => {
                return ant >= dep
            });
            console.log(novo)
            $('#modal').modal('show');
            document.querySelector('#btn-inserir').classList.add('nao-mostrar');
            document.querySelector('#btn-alterar').classList.remove('nao-mostrar');
            document.querySelector('#btn-deletar').classList.remove('nao-mostrar');
            document.querySelector('.modal-title').innerHTML = 'Alterar tarefa';

            // Setando o focus no campo descricao tarefa
            document.querySelector('#descricao-tarefa').focus();

            //Limpando os campos do formulário
            tarefa.id = novo[novo.length - 1].id;
            document.querySelector('#descricao-tarefa').value = novo[novo.length - 1].descricao;
            document.querySelector('#data-tarefa').value = dataToInput(novo[novo.length - 1].data);
        }

    }).catch(err => console.log(err))
}