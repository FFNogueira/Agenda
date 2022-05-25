exports.getLogoutPage = (req, res) => {
    // Acaba com a sessão do usuário:
    req.session.destroy(function () {
        return res.redirect('/');
    });


};