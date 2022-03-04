const { passwordValidator } = require("../../../validator/securityValidator")
const bcrypt = require("bcrypt");
const User = require("../../../models/user");

function securityController() {
    return {
        index: (req, res) => {
            return res.render("setting/security")
        },
        changePassword: async (req, res) => {
            const { currentPassword, newPassword, confirmPassword } = req.body;

            const { error } = passwordValidator.validate(req.body);

            if (error) {
                req.flash("error", "All fields are required.")
                return res.redirect("/setting/security");
            }

            let regExpPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{7,15}$/;
            if (!currentPassword.match(regExpPassword) || !newPassword.match(regExpPassword) || !confirmPassword.match(regExpPassword)) {
                req.flash("error", "Password dosen't satisfied expected conditions.");
                return res.redirect("/setting/security");
            }

            const user = await User.findOne({ _id: req.user._id });

            bcrypt.compare(currentPassword, user.password).then(async match => {
                if (match) {
                    if (newPassword == confirmPassword) {
                        // Encode password (Hase Password)
                        const hashedPassword = await bcrypt.hash(newPassword, 10);

                        await User.findOneAndUpdate(
                            { _id: req.user._id },
                            {
                                $set: {
                                    password: hashedPassword
                                },
                            },
                            { returnOriginal: false }
                        );

                        req.logout();
                        return res.redirect("/authentication/login");
                    } else {
                        req.flash("error", "Password dose't match.")
                        return res.redirect("/setting/security");
                    }
                } else {
                    req.flash("error", "Wrong password.")
                    return res.redirect("/setting/security");
                }
            }).catch(error => {
                req.flash("error", "Somthing went worng.")
                return res.redirect("/setting/security");
            })
        }
    }
}

module.exports = securityController;