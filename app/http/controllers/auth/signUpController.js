function signUpController(){
    return{
        index: (req,res) => {
            return res.render("auth/signUp/step1");
        }
    }
}

module.exports = signUpController;