

exports.CheckCsrfError = (err, req, res, next) => {
    // Se ocorreu algum erro...
    if (err) {
        // Se o erro é de token CSRF...
        if ('EBADCSRFTOKEN' === err.code) {
            res.send('Error in CSRF token!');
        }
        // Se o erro é outro...
        else {
            res.render('404.ejs');
        }
        return;
    }

    next();
};

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();

    next();
};

exports.redirectIfNotLogged = (req, res, next) => {

    if (req.session?.user) {
        res.locals.sessionUser = req.session.user.usuario;
        next();
    }
    else {
        return res.redirect('/');
    }


};

exports.redirectIfLogged = (req, res, next) => {

    if (req.session?.user) {
        req.session.save(function () {
            return res.redirect('/');
        });
    }
    else {
        next();
    }


};