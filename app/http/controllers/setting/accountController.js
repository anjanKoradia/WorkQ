const User = require("../../../models/user");
const userDetailsValidator = require("../../../validator/userDetailsValidator");

function accountController() {
    return {
        index: (req, res) => {
            return res.render("setting/account");
        },
        postData: async (req, res) => {
            const { username, email, name, address, city, state, zipcode } = req.body;

            const { error } = userDetailsValidator.validate(req.body);
            if (error) {
                req.flash("error", "All fields are required.");
                return res.redirect("/setting/account");
            }

            // check if username is alredy exists in database
            if (!(username == req.user.username)) {
                const existUsername = await User.findOne({ username: username });
                if (existUsername) {
                    req.flash("error", "Username is already taken.");
                    return res.redirect("/setting/account");
                }
            }
            // check if email is alredy exists in database
            if (!(email == req.user.email)) {
                const existEmail = await User.findOne({ email: email });
                if (existEmail) {
                    req.flash("error", "Email is already used.");
                    return res.redirect("/setting/account");
                }
            }

            let result = await User.findOneAndUpdate(
                { _id: req.user._id },
                {
                    $set: {
                        username: username,
                        email: email,
                        details: {
                            name: name,
                            address: address,
                            city: city,
                            state: state,
                            zipcode: zipcode,
                        }
                    },
                },
                { returnOriginal: false }
            );

            req.flash("success", "Details saved successfully.")
            return res.redirect("/setting/account");
        },
        deactivate: async (req, res) => {
            let user = await User.findOneAndRemove({ _id: req.user._id });
            return res.redirect('/');
        }
    }
}

module.exports = accountController;