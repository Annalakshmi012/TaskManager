const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
module.exports = function(req,res,next){
  const authHeader = req.header('Authorization');
  if(!authHeader) return res.status(401).json({message:'No token'});
  const token = authHeader.split(' ')[1];
  if(!token) return res.status(401).json({message:'No token'});
  try{
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  }catch(e){
    res.status(401).json({message:'Invalid token'});
  }
}
