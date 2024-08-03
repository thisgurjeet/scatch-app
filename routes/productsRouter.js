const express = require('express');
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");

// Creating a product and uploading to the database
router.post("/create", upload.single("image"), async function(req, res){
    try {
        let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;
        
        let product = await productModel.create({
            image: req.file.buffer,
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor,
        });
        
        // Set a success flash message
        req.flash("success", "Product created successfully");

        // Redirect to the admin page
        res.redirect("/owners/admin");
    } catch (err) {
        res.send(err.message);
    }
});

module.exports = router;
