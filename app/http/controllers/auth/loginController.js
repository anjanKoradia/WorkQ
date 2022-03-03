const passport = require("passport");
const { loginValidator } = require("../../../validator/authValidator");

function loginController() {
    return {
        index: (req, res) => {
            return res.render("auth/login");
        },
        login: (req, res, next) => {
            const { error } = loginValidator.validate(req.body);

            if (error) {
                if (error._original.email) {
                    req.flash("error", "Password is required.");
                } else {
                    req.flash("error", "Email is required.");
                }
                return res.redirect("/authentication/login");
            }

            passport.authenticate("local", (error, user, info) => {
                if (error) {
                    req.flash("error", info.message);
                    return next(error);
                }

                if (!user) {
                    req.flash("error", info.message);
                    return res.redirect("/authentication/login");
                }

                req.logIn(user, (error) => {
                    if (error) {
                        req.flash("error", info.message);
                        return next(error);
                    }

                    return res.redirect("/");
                });
            })(req, res, next);
        }
    }
}

module.exports = loginController;