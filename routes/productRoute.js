const Product = require("../models/productModel");
// const { castObject } = require("../models/userModel");
const { verifyTokenAdmin } = require("./verifyToken");
const router = require("express").Router();

//CREATE
router.post("/" , async(req , resp)=>{
    const newproduct = new Product(req.body);
    try{
        const savedProduct = await newproduct.save();
        resp.status(200).json(savedProduct);
    }
    catch(err){
        resp.status(403).json(err);
    }
})

//GET ALL PRODUCTS
router.get("/" , async (req , resp)=>{
    const qcatagory = req.query.catagory;
    try{
        let products;
        if(qcatagory){
            products = await Product.find({
                catagories:{
                    $in : [qcatagory],
                },
            })
        }
        else{
            products = await Product.find();
        }
        resp.status(200).json(products);
    }
    catch(err){
        resp.status(403).json(err);
    }
})

//GET PRODUCT

router.get("/find/:id" , async(req , resp ) =>{
    try{
        const product = await Product.findById(req.params.id);
        resp.status(200).json(product);
    }
    catch(err) {
        resp.status(403).json(err);
    }
})
module.exports = router;