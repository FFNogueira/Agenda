
exports.postEditReq = function (req, res) {

    req.session.lastEdit = req.body;
    // Redireciona (faz uma requisição 'get') para a homepage:
    req.session.save(function () {
        // TO DO: criar a rota "get" da página de edição:
        return res.send();
    });

}