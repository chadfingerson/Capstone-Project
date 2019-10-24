module.exports.User = function() {
    return function secured (req, res, next) {
        if ((req.user) && (req.session.role == 'Users')) { return next(); }
        req.session.returnTo = '/';
        res.redirect('/');
    };
};

module.exports.Admin = function() {
    return function secured (req, res, next) {
        if ((req.user) && (req.session.role == 'Admin')) { return next(); }
        req.session.returnTo = '/';
        res.redirect('/');
    };
};