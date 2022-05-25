const Edit = require('../modules/Edit.js');

exports.getEditPage = function (req, res) {
    if (req.session?.lastEdit) {
        return res.render('contactEdit.ejs', {
            editBody: req.session.lastEdit
        });
    }
    else {
        return res.redirect('/');
    }
};

exports.postEditPage = async function (req, res) {

    const myEdit = new Edit(req.body, req.session.lastEdit, req.session.user.email);

    await myEdit.validate();

    // Se edição der errado...
    if (myEdit.error.length > 0) {
        return res.render('contactEdit.ejs', {
            editBody: req.body,
            editError: myEdit.error
        });
    }
    // Se edição der certo...
    else {
        req.session.lastEdit = req.body;
        req.session.save(function () {
            return res.render('contactEdit.ejs', {
                editBody: req.body,
                editSuccess: true
            });
        });

    }
};