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
debugger
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
                                    <span class="card-subtitle mb-2 text-muted">${dataToString(item.data)}</span>
                                </div>
                                <p class="card-text">${item.descricao}</p>
                                </div>
                            `;
          // Adicionando o cartão no painel de tarefas
          painelTarefas.appendChild(cartao);

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

  // Criar um objeto tarefa
  let tarefa = {};
  tarefa.descricao = descricao;
  tarefa.data = data;
  tarefa.realizado = false;

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