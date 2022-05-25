// Importando a classe do model da página de Registro:
const Register = require('../models/RegisterModel.js').Register;

exports.postRegisterPage = async function (req, res) {
    // Cria um objeto da classe "Register" (faz o tratamento dos Registers)
    const myRegister = new Register(req.body);
    // Tenta validar o Register:
    await myRegister.validate();

    // Se ocorreu erro durante o registro:
    if (myRegister.error.length > 0) {
        return res.render('login.ejs', {
            loginRegisterError: myRegister.error,
            error: 2,
            usuario: req.body.usuario,
            email: req.body.email
        });
    }
    // Se não houve erro no registro:
    res.render('registerSuccess.ejs');

};