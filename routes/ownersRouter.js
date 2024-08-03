const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner-model');

router.get("/", function(req, res){
    res.send("hey bawa");
});

// creating an owner
if(process.env.NODE_ENV === "development"){
    router.post("/create", async function(req, res){
      // check if owner is already created  
      let owners = await ownerModel.find();
      if(owners.length>0) {
        return res.send(503).send("No permission to create owner");
      }
      // create an owner
     let {fullname, email, password} = req.body; 
     let createdOwner = await ownerModel.create({
        fullname,
        email, 
        password,
      });

      res.status(201).send(createdOwner);
    })
}

// admin to create new products
router.get("/admin", function(req, res){
  let successMessage = req.flash('success'); // Assuming you are using flash messages
  res.render("createproducts", { success: successMessage });
});




module.exports = router;