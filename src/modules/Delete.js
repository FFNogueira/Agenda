const ContactsModel = require('../models/ContacstModel.js').ContactsModel;

class Delete {

    constructor(body, userMail) {
        this.body = body;
        this.userMail = userMail;
        this.found = false;
    }

    async validate() {
        try {
            this.#checkIfInputsAreStrings();
            delete this.body._csrf;

            // Tenta encontrar os contatos do usuário no Banco de Dados
            const doc = await ContactsModel.findOne({ userMail: this.userMail });
            // Se usuário não foi encontrado...
            if (!doc) {
                return; // neste ponto, "this.found" é false
            }
            // Se usuário foi encontrado...
            await this.#deleteContact(doc);
        }
        catch (e) {
            console.log(e);
        }
    }

    #checkIfInputsAreStrings() {
        for (let i in this.body) {
            /* Se uma das propriedades de "req.body" não for string,
               então a substitua por uma string vazia: */
            if (typeof this.body[i] !== 'string') this.body[i] = '';
        }
    }

    async #deleteContact(doc) {

        // Se contato que se deseja deletar não existe na lista de contatos do usuário...
        if (!this.#contactExists(doc.contatos)) {
            return; // neste ponto, "this.found" é false
        }
        // Se contato que se deseja editar existe...
        // Deleta contato do Banco de dados...
        await ContactsModel.updateOne({ _id: doc._id },
            { "$pull": { "contatos": this.body } },
            { safe: true, multi: true });

        this.found = true;
    }

    #contactExists(contactArray) {
        let found;
        for (let i of contactArray) {
            found = true;
            for (let k of Object.keys(i)) {
                if (i[k] !== this.body[k]) {
                    found = false;
                    break;
                }
            }

            if (found) return true;
        }
        return false;
    }

}


module.exports = Delete;