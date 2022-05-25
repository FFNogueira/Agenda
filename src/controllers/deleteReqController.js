const Delete = require('../modules/Delete.js');

exports.postDeleteReq = async function (req, res) {

    const myDelete = new Delete(req.body, req.session.user.email);
    await myDelete.validate();

    //se der tudo certo na deleção:
    if (myDelete.found) {
        req.session.save(function () {
            return res.send();
        });
    }
    // Senão
    else {
        req.session.save(function () {
            return res.status(404).send();
        });
    }
}