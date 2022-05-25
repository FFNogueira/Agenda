// Importando o model da página de login:
const Login = require('../modules/Login.js')

exports.getLoginPage = (req, res) => {

    return res.render('login.ejs');

};

exports.postLoginPage = async function (req, res) {
    // Cria um objeto da classe "Login" (faz o tratamento dos logins)
    const myLogin = new Login(req.body);
    // Tenta validar o login:
    await myLogin.validate();

    // Se login der errado:
    if (myLogin.error.length > 0) {
        return res.render('login.ejs', {
            loginRegisterError: myLogin.error,
            error: 1,
            email: req.body.email
        });
    }

    // Se login der certo, salve a sessão do usuário:
    // "req.session.user" faz parte do pacote Sessions!
    req.session.user = myLogin.user;
    // Redireciona (faz uma requisição 'get') para a homepage:
    req.session.save(function () {
        return res.redirect('/');
    });


}; 