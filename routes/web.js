const loginController = require("../app/http/controllers/auth/loginController");
const signUpController = require("../app/http/controllers/auth/signUpController")

function initRoutes(app) {

    //signup
    app.get("/authentication/signup/step1", signUpController().index1);
    app.post("/authentication/signup/step1", signUpController().step1);
    // ---
    app.get("/authentication/signup/step2", signUpController().index2);
    app.post("/authentication/signup/step2", signUpController().step2);


    // login
    app.get("/authentication/login", loginController().index);
    app.post("/authentication/login", loginController().login);

}

module.exports = initRoutes;