const { signUpStep1Validator, signUpStep2Validator } = require("../../../validator/authValidator");
const User = require("../../../models/user");
const bcrypt = require("bcrypt");

let user;

function signUpController() {
  return {
    index1: (req, res) => {
      return res.render("auth/signUp/step1");
    },
    step1: async (req, res) => {
      const { email } = req.body;

      const { error } = signUpStep1Validator.validate(req.body);

      if (error) {
        if (error._original.email) {
          req.flash("error", "Accept Privacy policy and Term of use.");
        } else {
          req.flash("error", "Email is required.");
        }
        return res.redirect("/authentication/signup/step1");
      }

      // check if email is alredy exists in database
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        req.flash("error", "Email is already taken.");
        return res.redirect("/authentication/signup/step1");
      }

      user = new User({
        email: email
      });

      if (user) {
        return res.redirect("/authentication/signup/step2");
      } else {
        return res.redirect("/authentication/signup/step1");
      }
    },

    index2: (req, res) => {
      return res.render("auth/signUp/step2");
    },
    step2: async (req, res) => {
      const { username, password } = req.body;

      const { error } = signUpStep2Validator.validate(req.body);

      if (error) {
        if (error._original.username) {
          req.flash("error", "Password is required.");
        } else {
          req.flash("error", "Username is required.");
        }
        return res.redirect("/authentication/signup/step2");
      }

      // validate username and password formate
      let regExpUsername = /^[A-Za-z0-9]\w{7,14}$/;
      let regExpPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{7,15}$/;

      if (!username.match(regExpUsername)) {
        req.flash("error", "Username dosen't satisfied expected conditions.");
        return res.redirect("/authentication/signup/step2");
      }
      if (!password.match(regExpPassword)) {
        req.flash("error", "Password dosen't satisfied expected conditions.");
        return res.redirect("/authentication/signup/step2");
      }

      // check if username is alredy exists in database
      User.exists({ username: username }, (error, result) => {
        if (result) {
          req.flash("error", "Username is already taken.");
          return res.redirect("/authentication/signup/step2");
        }
      });

      // Encode password (Hase Password)
      const hashedPassword = await bcrypt.hash(password, 10);

      if (user) {
        user.username = username;
        user.password = hashedPassword;
      }

      if (user && user.email && user.username && user.password) {
        // save user in database
        user
          .save()
          .then((user) => {
            return res.redirect("/authentication/login");
          })
          .catch((error) => {
            console.log(error)
            req.flash("error", "Somthing went wrong.");
            return res.redirect("/authentication/signup/step1");
          });
      } else {
        req.flash("error", "Somthing went wrong.");
        return res.redirect("/authentication/signup/step1");
      }
    }
  };
}

module.exports = signUpController;
