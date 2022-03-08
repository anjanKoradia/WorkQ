const homeController = require("../app/http/controllers/homeController");
const loginController = require("../app/http/controllers/auth/loginController");
const signUpController = require("../app/http/controllers/auth/signUpController")
const accountController = require("../app/http/controllers/setting/accountController")
const securityController = require("../app/http/controllers/setting/securityController")
const workController = require("../app/http/controllers/workController");

// Middleware
const guest = require("../app/http/middleware/guest");
const user = require("../app/http/middleware/user");

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

    // profile
    app.get("/pofile/mywork/posted", user, workController().postedWorks);
    app.get("/pofile/mywork/accepted", workController().acceptedWork);


    // setting
    app.get("/setting/account", user, accountController().index);
    app.post("/setting/account", accountController().postData);
    app.post("/setting/account/deactivate", accountController().deactivate)

    // security
    app.get("/setting/security", user, securityController().index);
    app.post("/setting/security", securityController().changePassword);


    // Post work
    app.get("/volunteering/work/post", user, workController().index);
    app.post("/volunteering/work/post", workController().postWork);

    // Accept work
    app.post("/volunteering/work/accept/:id", workController().acceptWork);



    // Work categories
    app.get("/volunteering/work/category/:category", workController().category);
    app.get("/volunteering/work/category/:category/:id", workController().workDetails);
}

module.exports = initRoutes;