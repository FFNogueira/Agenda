const Contact = require('../models/ContacstModel.js').Contact;

exports.getContactsPage = function (req, res) {

    return res.render('newContacts.ejs');

}

exports.postContactsPage = async function (req, res) {

    // Cria um novo contato:
    let myContact = new Contact(req.body, req.session.user.email);
    // Tenta validar o contato criado:
    await myContact.validate();
    // Se ocorreu erro durante a criação do contato:
    if (myContact.error.length > 0) {
        return res.render('newContacts.ejs', {
            contactError: myContact.error
        });
    }
    // Se não ocorreu erros na criação do contato:
    else {
        return res.render('newContacts.ejs', {
            contactSuccess: true
        });
    }
}