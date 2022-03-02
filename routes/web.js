const signUpController = require("../app/http/controllers/auth/signUpController")

function initRoutes(app) {

    //auth
    app.get("/authentication/signup/step1", signUpController().index);
}

module.exports = initRoutes;