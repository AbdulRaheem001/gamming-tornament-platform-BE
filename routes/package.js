const express = require("express");
const Package = require("../models/coinPackage");
const router = express.Router();

router.post('/addPackage', async (req, res) => {
    const { name, coin, price } = req.body;
    console.log(req.body);
    try {
        if (!name || !coin || ! price) {
            return res.status(404).json({ error: "Some Data is missing" });
          }
          else{
            const package = new Package({
                name,
                coin,
                price,
              });
        
              await package.save();
          }
      res.status(200).json({ message: "Package Added Successfuly" });
    } catch (error) {
      console.error("Error finding tournament:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get("/getPackage", async(req, res) => {
    
    const package = await Package.find();
    if (package) {
      res.status(200).json(package);
    } else {
      res.status(404).json({ error: "Package not found" });
    }
  });
module.exports = router;