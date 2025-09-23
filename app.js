const express=require("express");
const { default: mongoose } = require("mongoose");
const app=express();
const Listing = require("./models/listing.js");
const path=require("path");
const methodOverride = require("method-override");
const ejsmate=require("ejs-mate");


main()
.then(()=>{
    console.log("Sucessfully connected to DB")
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
};

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine('ejs',ejsmate);


app.get("/listings",async(req, res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

app.get("/listings/:id",async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
});

app.post("/listings", async (req,res)=>{

    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
    
});

app.get("/listing/:id/edit",async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})


app.put("/listing/:id",async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect( `/listings/${id}`);
})

app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

app.get("/",(req,res)=>{
    res.send("Hi You connected");
});

app.listen(8080,()=>{
    console.log("sever is listening at port 8080");
})