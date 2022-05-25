// Importa o Mongoose:
const MONGOOSE = require('mongoose');
// Importa o pacote Validator:
const VALIDATOR = require('validator');
// Cria um esquema de dados para os Contatos:
const ContactSchema = new MONGOOSE.Schema({
    userMail: { type: String, required: true },
    contatos: { type: Array, required: true }
});
// Cria um 'model' para a Contatos do usuário:
const ContactsModel = MONGOOSE.model('Contacts', ContactSchema);

class Contact {

    constructor(body, userMail) {
        this.body = body;
        this.error = [];
        this.userMail = userMail;
    }

    async validate() {
        try {
            this.#checkIfInputsAreStrings();
            this.#formatForm();

            // Nome do contato não pode estar vazio:
            if (this.body.nome.length < 1) {
                this.error.push('O nome do contato não pode estar vazio!');
            }
            // Se o telefone não estiver vazio, então deverá ser válido:
            if (this.body.telefone.length > 0 && isNaN(Number(this.body.telefone))) {
                this.error.push('O telefone deve conter apenas números!');
            }

            // Se o email não estiver vazio, então deverá ser válido:
            if (this.body.email.length > 0 && !VALIDATOR.isEmail(this.body.email)) {
                this.error.push('E-mail inválido!');
            }

            if (this.error.length > 0) return;

            // Tenta capturar todos os contatos do usuário:
            let userContacts = await ContactsModel.findOne({ email: this.userMail });
            // Se o usuário não possui contatos:
            if (!userContacts) {
                await this.#createFirstContact();
            }
            // Senão, se já possui contatos:
            // Se o contato que se deseja adicionar já existe:
            else if (this.#contactAlreadyExists(userContacts)) {
                return this.error.push('Esse contato já existe!');
            }
            // Senão, finalmente cria o novo contato:
            else {
                await this.#createNewContact(userContacts);
            }

        }
        catch (e) {
            console.log(e);
            this.error.push('Ocorreu um erro durante a criação do contato!');
        }
    }

    async #createFirstContact() {
        await ContactsModel.create({
            userMail: this.userMail,
            contatos: [this.body]
        });
    }

    async #createNewContact(userContacts) {
        // Adiciona o novo contato ao array de contatos do Banco de dados:
        userContacts.contatos.push(this.body);

        // Salva o doc do usuário:
        await userContacts.save();
    }

    #contactAlreadyExists(userContacts) {

        let findFlag;
        // Procure entre os contatos se já existe aquele que se deseja cadastrar:
        for (let i of userContacts.contatos) {
            findFlag = true
            for (let k of Object.keys(i)) {
                if (i[k] !== this.body[k]) {
                    findFlag = false;
                    break;
                }
            }
            if (findFlag) {
                return true;
            }
        }
        return false;

    }

    #formatForm() {
        //Formata o registro do novo contato:
        this.body = {
            nome: this.body.nome,
            email: this.body.email,
            telefone: this.body.telefone,
            observacao: this.body.observacao
        }
    }

    #checkIfInputsAreStrings() {
        for (let i in this.body) {
            /* Se uma das propriedades de "req.body" não for string,
               então a substitua por uma string vazia: */
            if (typeof this.body[i] !== 'string') this.body[i] = '';
        }
    }

}

exports.Contact = Contact;
exports.ContactsModel = ContactsModel;