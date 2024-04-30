const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

const MONGO_URL="mongodb://127.0.0.1:27017/wander";
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}


app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


// app.get("/test",async(req,res)=>{
//     let sampleTesting= new Listing({
//         title:"My Home",
//         description:"Wonderfull Home",
//         price:1000,
//         location:"Bhusawal",
//         country:"India",
//     })
//     await sampleTesting.save();
//     console.log("Sample was saved");
//     res.send("succesfull testing");
// });

   //Index Route 1
   app.get("/listings",async(req,res)=>{
     const allListings=await Listing.find({});
     res.render("listings/index.ejs",{allListings});
    });

    //New Route 3
    app.get("/listings/new",(req,res)=>{
         res.render("listings/new.ejs");
    });

    //show Route 2
    app.get("/listings/:id",async(req,res)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id);
        res.render("listings/show.ejs",{listing});
    });

    //create Route for submit form new.ejs 4
    app.post("/listings",async (req,res)=>{
        const newListing=new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    });
    //Edit Route
    app.get("/listings/:id/edit",async(req,res)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id);
        res.render("listings/edit.ejs",{listing});
    });
    //Update Route
    app.put("/listings/:id",async(req,res)=>{
        let {id}=req.params;
        await Listing.findByIdAndUpdate(id,{...req.body.listing});
        res.redirect("/listings");
    });

    //Delete Route
    app.delete("/listings/:id",async(req,res)=>{
        let {id}=req.params;
        let deletedListing=await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        res.redirect("/listings");
    });
    app.get("/",(req,res)=>{
        res.send("Welcome to Home Page");
    })
    app.listen(8080,(req,res)=>{
        console.log("listening port 8080");
    });