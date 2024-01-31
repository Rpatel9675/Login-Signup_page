const express = require("express");
const path = require("path");
const app = express();
const port = 8080;
let mysql = require("mysql2");
const uuid = require("uuid");
const methoverride = require("method-override");
const connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    database:"pprlGroup",
    password:"Rocky@2001"
});
app.use(methoverride("_method"));
let {feker} = require("@faker-js/faker");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index.ejs");
});
app.post("/login", (req, res) => {
    let {email,password}=req.body;;
    let q=`SELECT * FROM users WHERE email='${email}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw(err);
            let users=result[0];
            if(result.length > 0 && result[0].password === password){
                 res.render("abc.ejs",{users});
            }
            else{
                let message = "Wrong password or email";
                res.send("wrong password or email");
            }
        });
        
    }catch{
        console.log("Error is: ",err);
    }
});
app.get("/signup",(req,res)=>{
    res.render("signup.ejs");
});
app.post("/signup/done",(req,res)=>{
    let{fname,lname,email,address,contact,bio,gender,password,confirmpassword}=req.body;
    let name= fname+' '+lname;
    let q=`INSERT INTO users (email,name,address,bio,gender,password) 
    VALUES ('${email}','${name}','${address}','${bio}', '${gender}', '${password}')`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw(err);
            res.send("Account created");
        })
    }catch{
        res.send("error in data insertion");
    }
    
});
app.listen(port, () => {
    console.log("Server is listening on port", port);
});

