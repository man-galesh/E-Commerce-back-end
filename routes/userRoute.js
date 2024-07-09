const User = require("../models/userModel")
const CryptoJS = require("crypto-js");
const { verifyTokenAndAuthorization , verifyTokenAdmin} = require("./verifyToken");
const router = require("express").Router();

router.get("/find/:id" , verifyTokenAndAuthorization, async(req , resp)=>{
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password,process.env.PASS).toString();
    }
    try{
        const updatedUser = User.findByIdAndUpdate(
            req.params.id,{
                $set:req.body,
            },
            {new: true}
        );
        resp.status(200).json(updatedUser);
    }
    catch(err){
        resp.status(500).json(err);
    }
});

//Delete

router.get("/:id" , verifyTokenAndAuthorization , async (req , resp)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        resp.status(200).json("User deleted");
    }
    catch(err){
        resp.status(403).json(err);
    };
})

//Get User

router.get("/find/:id" , verifyTokenAdmin , async(req , resp)=>{
    try{
        const user = await User.findById(req.params.id);
        const {password , ...rest } = user._doc;
        resp.status(200).json(rest);
    }
    catch(err){
        resp.status(500).json(err);
    }
});

//Get All User

router.get("/" , verifyTokenAdmin , async(req , resp)=>{
        const query = req.query.new;
        try{
            const users = query?await User.find().sort({_id : -1}).limit(5) : await User.find();
            resp.status(200).json(users);
        }
        catch(err){
            resp.status(500).json(err);
        }
});
