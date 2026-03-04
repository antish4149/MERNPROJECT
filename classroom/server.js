const express = require('express');
const app= express();
const session =require('express-session');
const flash = require('connect-flash');
const path=require('path');


const sessionParam = {
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
}

app.use(session(sessionParam));
app.use(flash());

app.set("view engine", "ejs"); // Set EJS as template engine
app.set("views", path.join(__dirname, "views"));


app.get('/register',(req,res)=>{
    let {name = "suraj"}=req.query;
    req.session.name=name;
    console.log(req.session.name);
    req.flash("success","user register successfully!");
    res.redirect('/hello');
})

app.get('/hello',(req,res)=>{
    console.log(req.flash("success"));
    res.locals.messages=req.flash("success");
    res.render("page.ejs",{name:req.session.name});
})
app.listen(3000,()=>{
    console.log("http://localhost:3000");
})