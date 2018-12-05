function mostrarMensagem(texto, tipo){

    let mensagem = document.querySelector('#mensagem');
    mensagem.innerHTML = texto;

    if (tipo == 's'){
        mensagem.className = 'alert alert-success mt-2';
    } else if (tipo == 'd'){
        mensagem.className = 'alert alert-danger mt-2';
    } else if (tipo == 'w'){
        mensagem.className = 'alert alert-warning mt-2';
    } 
    
    setTimeout(function(){
        mensagem.className = 'nao-mostrar';
    }, 3000);
}


function mostrarAlerta(texto){

    let mensagem = document.querySelector('#mensagem');
    mensagem.innerHTML = texto;

    <div class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <p>Modal body text goes here.</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary">Save changes</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
        </div>
    </div>
    </div>

    mensagem.className = 'alert alert-warning mt-2';
    
}
