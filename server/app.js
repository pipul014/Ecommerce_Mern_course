require("dotenv").config();

const express = require("express");
const app = express();

require("./db/conn");

const cors = require("cors");

const port = 4009;


app.use(cors());          //enable Cors
app.use(express.json()); // to get json type data from FrontEnd


//admin Auth routes
const adminAuthroutes = require("./routes/admin/adminAuthroutes");
app.use("/adminauth/api", adminAuthroutes);


//product routes
const productroutes = require("./routes/products/productroutes");
app.use("/products/api", productroutes);


// user Auth routes
const userAuthRoutes = require("./routes/user/userAuthRoutes");
app.use("/userauth/api",userAuthRoutes);

// carts routes
const cartsroute = require("./routes/carts/cartsroutes");
app.use("/carts/api",cartsroute)


app.get("/", (req, res) => {
    res.status(200).json("server start");
});

//start server
app.listen(port, () => {
    console.log(`server start at port no ${port}`);
});
