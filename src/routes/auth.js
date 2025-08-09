const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {body, validationResult} = require('express-validator');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
// Register
router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({min:6})
], async (req,res)=> {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  try{
    const {name,email,password} = req.body;
    let user = await User.findOne({email});
    if(user) return res.status(400).json({message:'User already exists'});
    const hashed = await bcrypt.hash(password, 10);
    user = new User({name,email,password:hashed});
    await user.save();
    const token = jwt.sign({id:user._id}, JWT_SECRET, {expiresIn:'7d'});
    res.json({token, user:{id:user._id, name:user.name, email:user.email}});
  }catch(e){
    console.error(e);
    res.status(500).json({message:'Server error'});
  }
});
// Login
router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  try{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({message:'Invalid credentials'});
    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(400).json({message:'Invalid credentials'});
    const token = jwt.sign({id:user._id}, JWT_SECRET, {expiresIn:'7d'});
    res.json({token, user:{id:user._id, name:user.name, email:user.email}});
  }catch(e){
    console.error(e);
    res.status(500).json({message:'Server error'});
  }
});
module.exports = router;
