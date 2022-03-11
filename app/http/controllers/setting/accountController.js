const handleMultipartData = require("../../../config/multer/profileImg");
const User = require("../../../models/user");
const fs = require("fs");
const userDetailsValidator = require("../../../validator/userDetailsValidator");

function accountController() {
    return {
        index: (req, res) => {
            return res.render("setting/account");
        },
        postData: (req, res) => {
            handleMultipartData(req, res, async (err) => {
                if (err) {
                    req.flash(err.message);
                    return res.redirect("/setting/account")
                }

                // path of image save in folder
                let fileName;

                if (req.file) {
                    fileName = req.file.filename;
                }

                const { error } = userDetailsValidator.validate(req.body);

                if (error) {
                    if (fileName) {
                        fs.unlink(
                            `${appRoot}/public/images/profiles/${fileName}`,
                            (err) => {
                                if (err) {
                                    return req.flash("error", "Somthing went wrong.");
                                }
                            }
                        );
                    }

                    req.flash("error", "All fields are required.");
                    return res.redirect("/setting/account");
                }

                const { username, email, name, address, city, state, zipcode } = req.body;

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

                let existingImg = await User.findById(req.user._id);

                try {
                    if (fileName) {
                        if (existingImg.details.image) {
                            fs.unlink(
                                `${appRoot}/public/${existingImg.details.image}`,
                                (err) => {
                                    if (err) {
                                        return req.flash("error", "Somthing went wrong.");
                                    }
                                }
                            );
                        }

                        await User.findOneAndUpdate(
                            { _id: req.user._id },
                            {
                                $set: {
                                    username: username,
                                    email: email,
                                    details: {
                                        name: name,
                                        image: `images/profiles/${fileName}`,
                                        address: address,
                                        city: city,
                                        state: state,
                                        zipcode: zipcode,
                                    }
                                },
                            },
                            { returnOriginal: false }
                        );
                    } else {
                        await User.findOneAndUpdate(
                            { _id: req.user._id },
                            {
                                $set: {
                                    username: username,
                                    email: email,
                                    details: {
                                        name: name,
                                        image: existingImg.details.image,
                                        address: address,
                                        city: city,
                                        state: state,
                                        zipcode: zipcode,
                                    }
                                },
                            },
                            { returnOriginal: false }
                        );
                    }
                } catch (err) {
                    fs.unlink(`${appRoot}/public/images/profiles/${fileName}`, (err) => {
                        if (err) {
                            req.flash("error", "Somthing went worng.");
                            return res.redirect("/setting/account");
                        }
                    });
                    console.log(err)
                    req.flash("error", "Somthing went worng.");
                    return res.redirect("/setting/account");
                }

                req.flash("success", "Details saved successfully.")
                return res.redirect("/setting/account");
            });
        },
        deactivate: async (req, res) => {
            let user = await User.findOneAndRemove({ _id: req.user._id });
            return res.redirect('/');
        }
    }
}

module.exports = accountController;