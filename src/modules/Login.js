// Importa o pacote Validator:
const VALIDATOR = require('validator');
// Importa o pacote Bcryptjs:
const BCRYPTJS = require('bcryptjs');
// Importa o RegisterModel:
const RegisterModel = require('../models/RegisterModel.js').RegisterModel;

class Login {

    constructor(body) {
        this.body = body;
        this.error = [];
        this.user = null;
    }

    async validate() {
        try {
            this.#checkIfInputsAreStrings();

            // senha deve ter entre 6 e 50 caracteres:
            if (this.body.senha.length < 6 || this.body.senha.length > 50) {
                this.error.push('A senha deve conter entre 6 e 50 caracteres!');
            }
            // O e-mail deve ser válido:
            if (!VALIDATOR.isEmail(this.body.email)) {
                this.error.push('E-mail inválido!');
            }
            if (this.error.length > 0) return;

            this.#formatForm();

            // Tenta encontrar o email informado dentro do banco de dados:
            this.user = await RegisterModel.findOne({ email: this.body.email });
            /* Se o e-mail informado não existir, ou...
               ...se senha informada não pertencer a esse email: */
            if (!this.user || !BCRYPTJS.compareSync(this.body.senha, this.user?.senha)) {
                //console.log(user.senha, this.body.senha); //debug
                return this.error.push('E-mail ou senha incorretos!');
            }
        }
        catch (e) {
            console.log(e);
            this.error.push('erro interno durante o login!');
        }
    }

    #formatForm() {
        this.body = {
            senha: this.body.senha,
            email: this.body.email
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

module.exports = Login;