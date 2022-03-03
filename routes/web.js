const loginController = require("../app/http/controllers/auth/loginController");
const signUpController = require("../app/http/controllers/auth/signUpController")

// Middleware
const guest = require("../app/http/middleware/guest");

function initRoutes(app) {

    //signup
    app.get("/authentication/signup/step1", guest, signUpController().index1);
    app.post("/authentication/signup/step1", signUpController().step1);
    // ---
    app.get("/authentication/signup/step2", guest, signUpController().index2);
    app.post("/authentication/signup/step2", signUpController().step2);


    // login
    app.get("/authentication/login", guest, loginController().index);
    app.post("/authentication/login", loginController().login);

}

module.exports = initRoutes;