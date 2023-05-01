const express=require("express");
const cookieparser=require("cookie-parser");
const sessions=require("express-session");
const app=express();

app.use(cookieparser());
app.use(sessions({
    saveUninitialized:true,
    resave:false,
    cookie:{maxAge:300000},
    secret:'asdas#431'
}))
const path=require("path");
const multer=require("multer");
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
//const upload=multer({dest:'public/files'});
const mstorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/files");

    },
    filename:(req,file,cb)=>{
        console.log(file);
        const ext=file.mimetype.split("/")[1]
        cb(null,req.session.username+"."+ext)
    }
})
const filter=(req,file,cb)=>{
    const ext=file.mimetype.split("/")[1];
    if(ext=="png")
    cb(null,true);
    else
    cb(new Error("File not supported"),false);
}
const upload=multer({storage:mstorage,fileFilter:filter});

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/upload.html"));
})

app.post("/uploadfile",upload.single("pic") ,(req,res)=>{

    res.redirect("/dashboard")

})

app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/login.html"));
})
app.post("/login",(req,res)=>{
    if(req.body.username==req.body.password)
    {
        req.session.username=req.body.username;
        res.redirect("/dashboard");

    }
    else
    res.redirect("/login");

})
app.get("/dashboard",(req,res)=>{
    res.sendFile(path.join(__dirname,"./public/dashboard.html"));
})
app.listen(3000);
