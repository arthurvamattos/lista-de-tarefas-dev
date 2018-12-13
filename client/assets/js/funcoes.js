// Caso o botão pesquisar seja clicado
document.querySelector('#btn-buscar').addEventListener('click', function (event) {
  // Previne que o formulário seja submetido
  event.preventDefault();
  // Montar o formulário
  montarPainel();
});

// Definindo uma tarefa global para auxiliar na alteração de uma tarefa
let tarefa = {};

// Definindo a página atual
var paginaAtual = 1;


// Função para montar os cartões
function montarPainel() {

  // Mapeando o painel de tarefas do DOM
  let painelTarefas = document.querySelector('#painelTarefas');
  painelTarefas.innerHTML = '';

  // Capturando o texto da busca
  let filtro = document.querySelector('#texto-busca').value;

  // Espera o resultado da função listarTarefas()
  let promise = listarTarefasPaginado(paginaAtual, 5, filtro);
  promise
    // Caso o resultado seja processado
    .then(function (response) {
      // Caso não sejam encontradas tarefas via API
      if (response.data == null) {
        mostrarMensagem('Nenhuma tarefa encontrada para esta busca!', 'd');
      } else {

        // Caso sejam encontradas tarefas via API
        response.data.forEach(function (item) {
          // Criando o cartão
          let cartao = document.createElement('div');
          cartao.className = 'card';
          cartao.innerHTML = `
                                <div class="card-body">
                                <div>
                                    <span class="card-subtitle mb-2">${dataToString(item.data)}</span>
                                </div>
                                <p class="card-text">${item.descricao}</p>
                                </div>
                            `;
          // Adicionando o cartão no painel de tarefas
          painelTarefas.appendChild(cartao);

         //Quebra a data recebida do item (cartões) em partes
         let partesData = dataToString(item.data).split("/");

         //Monta uma nova data com as partes da data do item (cartões)
         let data = new Date(partesData[2], partesData[1] - 1, partesData[0]);

         //Cria uma nova data com a data local
         let x = new Date();

         //Cria uma nova data, sem informações de hora, baseada na data local
         let dataLocal = new Date(x.getFullYear(), x.getMonth(), x.getDate());

         //Se o item tiver sido realizado....
         if (item.realizado == 1) {
           //marca a tarefa como realizada
           cartao.classList.add('td-lt');
         }

         //Se a data do item for menor que a data atual E não tiver sido realizada....
         if (data < dataLocal && item.realizado == 0) {
           //pinta o cartão de vermelho
           cartao.classList.add('card-expirado');
           //muda a fonte para branco
           cartao.classList.add('tc-w');
         }          


          cartao.addEventListener('click', function (event) {
            montarFormularioAlterar(item.id);
            tarefa.id = item.id;
          });

          montarPaginacao(response.pageCount || 1)
        });
      }

    })
    // Caso o resultado não seja processado
    .catch(function (error) {
      console.log(error);
    });
}

// Quando o botão adicionar uma nova tarefa for clicado
document.querySelector('#btn-adicionar').addEventListener('click', function (event) {

  event.preventDefault();

  // Mostra o modal
  $('#modal').modal('show');

  // Muda o layout do modal
  document.querySelector('#btn-inserir').classList.remove('nao-mostrar');
  document.querySelector('#btn-alterar').classList.add('nao-mostrar');
  document.querySelector('#btn-deletar').classList.add('nao-mostrar');
  document.querySelector('.modal-title').innerHTML = 'Inserir nova tarefa';

  // Setando o focus no campo descricao-tarefa
  document.querySelector('#descricao-tarefa').focus();

    // Limpando os campos do formulário
    document.querySelector('#descricao-tarefa').value = '';
    document.querySelector('#data-tarefa').value = '';
    document.querySelector('#status-tarefa').checked = false;
  // Limpando os campos do formulário
  document.querySelector('#descricao-tarefa').value = '';
  document.querySelector('#data-tarefa').value = '';
});

// Quando o botão inserir for clicado
document.querySelector('#btn-inserir').addEventListener('click', function (event) {

  event.preventDefault();
  inserir();
});

// Função para inserir dados via API
function inserir() {

    // Capturar os dados do formulário
    let descricao = document.querySelector('#descricao-tarefa').value;
    let data = document.querySelector('#data-tarefa').value;
    let realizado = document.querySelector('#status-tarefa').checked; //true or false

    // Criar um objeto tarefa
    let tarefa = {};
    tarefa.descricao = descricao;
    tarefa.data = data;
    tarefa.realizado = realizado;

    // Inserir uma nova tarefa
    let promise = inserirTarefa(tarefa);
    promise
        .then(function (response) {
            mostrarMensagem('Tarefa inserida com sucesso', 's');
            montarPainel();
        })
        .catch(function (erro) {
            mostrarMensagem(erro, 'd');
        });

    // Mostra o modal
    $('#modal').modal('toggle');
}

// Função que monta o formulário para alterar
function montarFormularioAlterar(id) {

  let promise = listarTarefaPorId(id);
  promise
    .then(function (tarefa) {

            // Campos do formulário
            document.querySelector('#idTarefa').value = tarefa.id;
            document.querySelector('#descricao-tarefa').value = tarefa.descricao;
            document.querySelector('#data-tarefa').value = dataToInput(tarefa.data);
            document.querySelector('#status-tarefa').checked = tarefa.realizado;

      // Mostra o modal
      $('#modal').modal('show');

      // Muda o layout do modal
      document.querySelector('#btn-inserir').classList.add('nao-mostrar');
      document.querySelector('#btn-alterar').classList.remove('nao-mostrar');
      document.querySelector('#btn-deletar').classList.remove('nao-mostrar');
      document.querySelector('.modal-title').innerHTML = 'Alterar tarefa';

      // Setando o focus no campo descricao-tarefa
      document.querySelector('#descricao-tarefa').focus();

    })
    .catch(function (erro) {
      mostrarMensagem(erro, 'd');
    });
}


// Quando o botão alterar for clicado
document.querySelector('#btn-alterar').addEventListener('click', function (event) {

    // Dados do formulário
    tarefa.descricao = document.querySelector('#descricao-tarefa').value;
    tarefa.data = document.querySelector('#data-tarefa').value;
    tarefa.realizado = document.querySelector('#status-tarefa').checked;
  event.preventDefault();

  // Dados do formulário
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

});

function montarPaginacao(numeroPaginas) {
  
  let lista = document.getElementById("lista-paginacao");
  lista.innerHTML = "";


  
  let liAnterior = montarItemPaginacao(paginaAtual - 1, "Anterior", paginaAtual <= 1)
  let liProximo = montarItemPaginacao(paginaAtual + 1, "Próximo", paginaAtual >= numeroPaginas)

  lista.appendChild(liAnterior);

  for (let i = 1; i <= numeroPaginas; i++) {
    let li = montarItemPaginacao(i, i, false);
    lista.appendChild(li);
  }

  lista.appendChild(liProximo);
}

function montarItemPaginacao(valor, titulo = valor, disabled) {
    let li = document.createElement('li');
    li.className = `page-item  ${disabled ? 'disabled' : ''} ${paginaAtual == valor ? 'active' : ''}`.trim();

    let a = document.createElement('a');
    a.className = `page-link`
    a.innerText = titulo;
    a.href = '#';

    a.addEventListener('click', e => {
        paginaAtual = valor
        montarPainel();
      })

    li.appendChild(a);

    return li;
}

//Quando clicar o btn-deletar...
document.querySelector('#btn-deletar').addEventListener('click',function(event){
  event.preventDefault();
  //confirmar exclusao
  $('#modal').modal('hide');
  $('#modal-excluir').modal('toggle');
});

//Função de confirmação

function confirmarExclusao(){
  let promise = deletarTarefa(tarefa.id);
  promise 
  .then(function(resolve){
      mostrarMensagem('Tarefa deletada com sucesso','s');
      montarPainel();
  })
  .catch(function(erro){
      mostrarMensagem(erro,'d');
  }); 
  //fechar o formulario
  $('#modal-excluir').modal('toggle');
}

function tarefasVencer() {
    
    let promise = listarTarefas("");
    promise
        .then(function (response) {

            if (response == null) {
                mostrarMensagem('Nenhuma tarefa encontrada para esta busca!', 'd');
            } else {
                let lista = document.querySelector('#lista-alerta');

                //Gerando data atual
                let now = new Date(); 
                let dia = now.getDate();
                    if(dia < 10){
                        dia = "0"+dia;
                    }
                let mes = now.getMonth()+1;         
                let ano = now.getFullYear();

                //Montando data atual no formato de comparação
                dataHoje = dia+"/"+mes+"/"+ano;

                response.forEach(function (item) {
                    let strData = dataToString(item.data);       
                    
                    if(strData === dataHoje && item.realizado === 0){ //Comparando datas
                        
                        //Criando itens da lista com as tarefas que vencem hoje
                        let alerta = document.createElement('li');
                        alerta.className = 'list-group-item';
                        alerta.innerHTML = `${item.descricao}`;
                        $('#modal-alerta').modal('show');
                        document.querySelector('#btn-alerta').focus();
                        lista.appendChild(alerta); //Adicionando a lista
                        
                        // Clicando no botão de confirmação
                        document.querySelector('#btn-alerta').addEventListener('click', function(){
                            $('#modal-alerta').modal('hide'); //Esconde a modal
                        });

                        //Chamando modal de alteração
                        alerta.addEventListener('click', function(event){                            
                            $('#modal-alerta').modal('toggle'); //Fecha a modal de alerta
                            montarFormularioAlterar(item.id);
                            tarefa.id = item.id;
                    });
                    }
                });
            }
        })
        // Caso o resultado não seja processado
        .catch(function (error) {
            console.log(error);
        });
}