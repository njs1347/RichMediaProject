//middleware Login function
var requiresLogin = function(req, res, next){
    
    if(!req.session.account){
        return res.redirect('/');
    }
    
    next();
};

//middleware Logout function
var requiresLogout = function(req, res, next){
  if(req.session.account){
      return res.redirect('/app');
  }  
    
    next();
};

//module exports
module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;
