var controllers = require('./controllers');
var mid = require('./middleware');


var router = function(app){
    app.get("/login", mid.requiresLogout, controllers.Account.loginPage);
    app.post("/login", controllers.Account.login);
    
    app.get("/signup", controllers.Account.signupPage);
    app.post("/signup", controllers.Account.signup);
    
    app.get("/logout", controllers.Account.logout);
    
     app.get("/app", mid.requiresLogin, controllers.drawPageCall.drawPage);
    
    
    app.get("/",mid.requiresLogout, controllers.Account.loginPage);
    
};


module.exports = router;