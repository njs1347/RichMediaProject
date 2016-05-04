var models = require('../models');

var Account = models.Account;

var loginPage = function(req,res){
  res.render('login');  
};

var signupPage = function(req, res){
  res.render('signup');  
};

var logout = function(req, res){
    req.session.destroy();
  res.redirect('/');  
};

var login = function(req, res){
    
    var username = req.body.username;
    var password = req.body.pass;
    if(!username || !password){
        return res.status(400).json({error: "Please enter username and password"});
    }
    
    Account.AccountModel.authenticate(username,password, function(err, account){
       if(err || !account){
           return res.status(401).json({error: "Wrong username or password"});
       }
        req.session.account = account.toAPI();
        
        res.json({redirect: '/app'});
        
    });
    
};

var signup = function(req, res){
    var body = req.body;
    
    if(!body.username || !body.pass || !body.pass2){
        return res.status(400).json({error: "All fields are required"});
    }
    
    if(body.pass !== body.pass2){
        return res.status(400).json({error: "Passwords do not match"});
    }
    
    Account.AccountModel.generateHash(body.pass, function(salt, hash){
       
        var accountData = {
            username: body.username,
            salt: salt,
            password: hash
        };
        
        var newAccount = new Account.AccountModel(accountData);
        
        newAccount.save(function(err){
           if(err){
               console.log(err);
               return res.status(400).json({error:"An error occured in your account"});
           }
            req.session.account = newAccount.toAPI();
            
            res.json({redirect: '/app'});
            
        });
    });
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;