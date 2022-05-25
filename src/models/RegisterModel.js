// Importa o Mongoose:
const MONGOOSE = require('mongoose');
// Importa o pacote Validator:
const VALIDATOR = require('validator');
// Importa o pacote Bcryptjs:
const BCRYPTJS = require('bcryptjs');
// Cria um esquema de dados para a homepage:
const RegisterSchema = new MONGOOSE.Schema({
    email: { type: String, required: true },
    senha: { type: String, required: true },
    usuario: { type: String, required: true }
});
// Cria um 'model' para a Register:
const RegisterModel = MONGOOSE.model('Register', RegisterSchema);

class Register {

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
            // Usuário deve ter entre 6 e 20 caracteres:
            if (this.body.usuario.length < 6 || this.body.usuario.length > 20) {
                this.error.push('O nome de usuário deve conter entre 6 e 20 caracteres!');
            }
            if (this.error.length > 0) return;
            // Checa se o email informado já está em uso:
            if (await RegisterModel.findOne({ email: this.body.email }))
                return this.error.push('Esse e-mail já está em uso!');

            this.#formatForm();
            // Se tudo estiver certo, tenta criar o novo usuário:
            await this.#registerToDB();
        }
        catch (e) {
            console.log(e);
            this.error.push('Ocorreu um erro durante a criação da conta!');
        }
    }

    #formatForm() {
        // Prepara um hash:
        const salt = BCRYPTJS.genSaltSync();
        //Formata o registro do novo usuário:
        this.body = {
            senha: BCRYPTJS.hashSync(this.body.senha, salt), // Hash da senha do usuário!
            email: this.body.email,
            usuario: this.body.usuario
        }
    }

    #checkIfInputsAreStrings() {
        for (let i in this.body) {
            /* Se uma das propriedades de "req.body" não for string,
               então a substitua por uma string vazia: */
            if (typeof this.body[i] !== 'string') this.body[i] = '';
        }
    }

    async #registerToDB() {
        // Registra um novo usuário no Banco de Dados:
        // O método ".create()" retorna uma promise:
        this.user = await RegisterModel.create(this.body);
    }
}

exports.Register = Register;
exports.RegisterModel = RegisterModel;