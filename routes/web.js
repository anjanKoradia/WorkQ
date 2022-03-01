const signUpController = require("../app/http/controllers/auth/signUpController");

function initRoutes(app) {

    //auth
    app.get("/authentication/signup", signUpController().index);
}

module.exports = initRoutes;