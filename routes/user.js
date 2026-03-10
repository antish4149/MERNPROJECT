const express = require('express');
const { route } = require('./listing');
const User= require('../models/user.js');
const wrapAsync = require('../util/wrapAsync.js');
const router = express.Router();
const passport =require('passport');

router.get('/signup',(req,res)=>{
    res.render("users/signup.ejs");
})

router.post('/signup',wrapAsync(async(req,res)=>{
    
    try{
        let{username, email, password} =req.body;
        let newUser = new User({
        username,
        email
    })
    const registerUser = await User.register(newUser,password);
    console.log(registerUser);
    req.flash("success","user registered");
    res.redirect('/listings');
    }catch(err){
        req.flash('error',err.message);
        res.redirect('/signup');
    } 
    
}))

router.get('/login',(req,res)=>{
    res.render("users/login.ejs");
})

router.post('/login',passport.authenticate("local",{ failureRedirect: '/login', failureFlash:true}),wrapAsync(async(req,res)=>{
    
    try{
    req.flash("success","Welcome back");
    res.redirect('/listings');
    }catch(err){
        req.flash('error',err.message);
        res.redirect('/login');
    } 
    
}))

module.exports = router;