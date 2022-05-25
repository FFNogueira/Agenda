class ReqDelete {

    constructor() { }

    start() {
        let table = document.querySelector('table');

        // Em caso de clique na tabela de contatos:
        table.addEventListener('click', this.#deleteClicked.bind(this));
    }

    async #deleteClicked(event) {
        try {
            // Se o elemento clicado for o botão de deletar:
            if (event.target.getAttribute('name') === 'deletar') {
                // Envia uma requisição POST à página de edição:
                await this.#sendPostRequest(event.target.parentNode);
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    async #sendPostRequest(tdTag) {
        // Lê o CSRF token da tag <meta> da página
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        const contactBody = this.#getContactBody(tdTag.parentNode);

        // Se o body da requisição for válido...
        if (contactBody) {

            // Espera pela resposta da requisição POST:
            let response = await fetch('/deleteReq', {
                headers: {
                    'CSRF-Token': token, // <-- is the csrf token as a header
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(contactBody),
            });

            // Se resposta da requisição POST está ok...
            if (response.status >= 200 && response.status < 400) {
                //Prossiga para a deleção VISUAL do contato...
                let trTag = tdTag.parentNode;
                trTag.parentNode.removeChild(trTag);
            }
        }
    }

    #getContactBody(trTag) {
        let body = {};

        for (let i of trTag.childNodes) {
            if (i.nodeType !== 1) continue;
            if (i.getAttribute('name') === 'actions') continue;
            body[i.getAttribute('name')] = i.innerText;
        }

        return (this.#checkBody(body) ? body : null);

    }

    #checkBody(body) {
        if ((Object.keys(body).length === 4) && ('nome' in body) && ('telefone' in body) && ('email' in body) && ('observacao' in body)) {
            return true;
        }
        return false;
    }

}



module.exports = ReqDelete;