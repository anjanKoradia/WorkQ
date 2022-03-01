function signUpController() {
    return {
        index: (req, res) => {
            return res.render("auth/signUp/signUp.ejs");
        }
    }
}

module.exports = signUpController;