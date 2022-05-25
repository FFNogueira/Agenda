const ContactsModel = require('../models/ContacstModel.js').ContactsModel;

exports.getHomepage = async function (req, res) {
    try {
        //se usuário já estiver logado:
        if (req.session?.user) {
            // Tenta recuperar os contatos do usuário do banco de dados:
            let doc = await ContactsModel.findOne({ userMail: req.session.user.email });
            // Limpa o auxiliar de edições de contatos:
            if (req.session.lastEdit) req.session.lastEdit = null;

            res.render('index.ejs', {
                // "contacts" recebe o array com todos os contatos do usuário:
                contacts: doc.contatos,
                sessionUser: req.session.user.usuario,
                csrfToken: req.csrfToken()
            });
        }
        // Se usuário não Estiver logado:
        else {
            res.render('index.ejs');
        }
    }
    catch (e) {
        console.log(e);
        res.render('index.ejs');
    }
};

exports.postHomepage = (req, res) => {
    res.send('The CSRF token is OK!');
};
