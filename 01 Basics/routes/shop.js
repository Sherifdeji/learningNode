const path = require("path");
const express = require("express");

const adminData = require("./admin");

// const rootDir = require("../util/path"); // we import the path module that we created to get the absolute path to the root directory of our project, this is useful for building paths to other files in our project

const router = express.Router();

// router.get("/", (req, res, next) => {
//   // we are using .get() here so we can do strict checking for '/' if that we used .use it will just check if it starts with /
//   console.log(adminData.products);
//   // res.sendFile(path.join(__dirname, "..", "views", "shop.html")); // __dirname is a global variabe by node, it holds the absolute path of our os down to the current file it is used inside, that is why we added '../' to be able to go back up; path.join will automatically build the path in a way that works on both linux and windows systems.
//   // // we can also use the rootDir that we imported to build the path to the file
//   res.sendFile(path.join(rootDir, "..", "views", "shop.html")); // we use path.join to build the path to the file, this is a good practice as it will work on both linux and windows systems
// });

router.get("/", (req, res, next) => {
  const products = adminData.products;
  res.render("shop", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
  });
});

module.exports = router;
