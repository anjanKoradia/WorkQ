const homeController = require("../app/http/controllers/homeController");
const loginController = require("../app/http/controllers/auth/loginController");
const signUpController = require("../app/http/controllers/auth/signUpController")
const accountController = require("../app/http/controllers/setting/accountController")

// Middleware
const guest = require("../app/http/middleware/guest");

function initRoutes(app) {

    app.get("/", homeController().index);

    //signup
    app.get("/authentication/signup/step1", guest, signUpController().index1);
    app.post("/authentication/signup/step1", signUpController().step1);
    // ---
    app.get("/authentication/signup/step2", guest, signUpController().index2);
    app.post("/authentication/signup/step2", signUpController().step2);


    // login
    app.get("/authentication/login", guest, loginController().index);
    app.post("/authentication/login", loginController().login);
    app.post("/logout", loginController().logout);


    // setting
    app.get("/setting/account", accountController().index);
    app.post("/setting/account", accountController().postData);

}

module.exports = initRoutes;