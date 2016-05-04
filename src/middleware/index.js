var requiresLogin = function(req, res, next){
    
    if(!req.session.account){
        return res.redirect('/');
    }
    
    next();
};

var requiresLogout = function(req, res, next){
  if(req.session.account){
      return res.redirect('/app');
  }  
    
    next();
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;
