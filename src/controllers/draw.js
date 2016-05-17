//funtion to be exported 
var drawPage = function(req, res){
    res.render('app');
}

//module exports
module.exports.drawPage = drawPage;