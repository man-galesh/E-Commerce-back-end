const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    title : {type: String , required : true},
    desc : {type: String , require: true},
    img: {type: String , require: true},
    catagories: {type: Array},
    size: {type: Array },
    color: {type: Array },
    price: {type: Number , required: true }
},
{timestamps: true}
)
module.exports = mongoose.model("Product" , productSchema);