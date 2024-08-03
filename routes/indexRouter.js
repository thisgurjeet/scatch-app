const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const router = express.Router();
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.get("/", function (req, res) {
    res.render("index", { error: "", loggedin: false });
});

router.get("/shop", isLoggedIn, async function(req, res){
    let products = await productModel.find(); 
    res.render("shop", { products });
});

router.get("/addtocart/:productid", isLoggedIn, async function(req, res){
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.productid);
    await user.save();
    res.redirect("/shop");
});

router.get("/cart", isLoggedIn, async function(req, res){
    let user = await userModel.findOne({ email: req.user.email }).populate("cart");
   
    if (user.cart.length === 0) {
        return res.render("cart", { user, bill: 0 });
    }

    const bill = user.cart.reduce((total, item) => {
        return total + (Number(item.price) + 20 - Number(item.discount));
    }, 0);

    res.render("cart", { user, bill });
});

module.exports = router;
