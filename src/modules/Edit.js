// Importa o pacote Validator:
const VALIDATOR = require('validator');
const ContactsModel = require('../models/ContacstModel.js').ContactsModel;

class Edit {

    constructor(newBody, oldBody, userMail) {
        this.newBody = { ...newBody };
        this.oldBody = { ...oldBody };
        this.userMail = userMail;
        this.error = [];
    }

    async validate() {
        try {
            this.#checkIfInputsAreStrings();
            this.#formatBodies();
            // Nome do contato não pode estar vazio:
            if (this.newBody.nome.length < 1) {
                this.error.push('O nome do contato não pode estar vazio!');
            }
            // Se o telefone não estiver vazio, então deverá ser válido:
            if (this.newBody.telefone.length > 0 && isNaN(Number(this.newBody.telefone))) {
                this.error.push('O telefone deve conter apenas números!');
            }
            // Se o email não estiver vazio, então deverá ser válido:
            if (this.newBody.email.length > 0 && !VALIDATOR.isEmail(this.newBody.email)) {
                this.error.push('E-mail inválido!');
            }

            if (this.error.length > 0) return;

            // Tenta encontrar os contatos do usuário no Banco de Dados
            const doc = await ContactsModel.findOne({ userMail: this.userMail });
            // Se usuário não foi encontrado...
            if (!doc) {
                return this.error.push('A operação não pôde ser executada!');
            }
            // Se usuário foi encontrado...
            await this.#updateContact(doc);

        }
        catch (e) {
            console.log(e);
            this.error.push('A operação não pôde ser executada!');
        }
    }

    #checkIfInputsAreStrings() {
        for (let i in this.newBody) {
            /* Se uma das propriedades de "req.body" não for string,
               então a substitua por uma string vazia: */
            if (typeof this.newBody[i] !== 'string') this.newBody[i] = '';
        }
    }

    async #updateContact(doc) {
        let index = this.#oldContactExists(doc.contatos);

        // Se contato que se deseja editar não existe na lista de contatos do usuário...
        if (index < 0) {
            return this.error.push('A operação não pôde ser executada!');
        }
        // Se contato que se deseja editar existe...
        doc.contatos.set(index, this.newBody);
        await doc.save();
    }

    #formatBodies() {
        delete this.newBody._csrf;
        delete this.oldBody._csrf;
    }

    #oldContactExists(contactArray) {
        let found;
        let index = 0;

        for (let i of contactArray) {
            found = true;
            for (let k of Object.keys(i)) {
                if (i[k] !== this.oldBody[k]) {
                    found = false;
                    break;
                }
            }

            if (found) return index;
            index++;
        }
        return -1;
    }

}


module.exports = Edit;