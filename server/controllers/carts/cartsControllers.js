const productsdb = require("../../model/product/productmodel");
const cardsDB = require("../../model/carts/cartsModel");
const cartsDB = require("../../model/carts/cartsModel");

exports.Addtocard = async (req, res) => {
    const { id } = req.params;
    try {
        const productfind = await productsdb.findOne({ _id: id }); //find product by user login id

        const carts = await cardsDB.findOne({ userid: req.userId, productid: productfind._id, });

        if (productfind?.quantity >= 1) {

            if (carts?.quantity >= 1) {

                //increment product in added product quantity in cart
                carts.quantity = carts.quantity + 1;
                await carts.save()

                //decrement product quantity
                productfind.quantity = productfind.quantity - 1;
                await productfind.save();

                res.status(200).json({ massege: "product successfully increment in your carts" })

            } else {
                // addtocart
                const addtocart = new cartsDB({
                    userid: req.userId,
                    productid: productfind._id,
                    quantity: 1
                })
                await addtocart.save();

                //decrementproduct quantity
                productfind.quantity = productfind.quantity - 1;
                await productfind.save();

                res.status(200).json({ massege: "product successfully added in your carts" })
            }
        } else {
            res.status(400).json({ error: "the product is sold out" })
        }

    } catch (error) {
        res.status(400).json(error);
    }
}

//getcartsvalue
exports.getcartsvalue = async (req, res) => {

    try {
        const getcarts = await cartsDB.aggregate([
            {
                $match: { userid: req.userMainId }
            },
            {
                $lookup: {
                    from: "productsmodels",
                    localField: "productid",
                    foreignField: "_id",
                    as: "productDetails"
                }
            }
        ]);
        res.status(200).json(getcarts);

    } catch (error) {
        res.status(400).json(error)
    }
}

//removesingleitem
exports.removeSingleitem = async (req, res) => {
    const { id } = req.params;

    try {
        const productfind = await productsdb.findOne({ _id: id }); //find product by user login id
        const carts = await cartsDB.findOne({ userid: req.userId, productid: productfind._id, });

        if (!carts) {
            res.status(400).json({ error: "carts not found" })
        }
        
        if (carts.quantity == 1) {
            const deleteCartItem = await cartsDB.findByIdAndDelete({ _id: carts._id });
            //incrementproduct quantity
            productfind.quantity = productfind.quantity + 1;
            await productfind.save();

            res.status(200).json({ massege: "Your Item Successfully Remove From Your Card",deleteCartItem });

        } else if (carts.quantity > 1) {
            carts.quantity = carts.quantity - 1;
            await carts.save()
            //incrementproduct quantity
            productfind.quantity = productfind.quantity + 1;
            await productfind.save();
            res.status(200).json({ massege: "Your Item Successfully Decrement From Your Card" })
        }

    } catch (error) {
        res.status(400).json(error);
    }
}

//removeAllitem
exports.removeAllitem = async(req, res)=>{
    const { id } = req.params;

    try {
        const productfind = await productsdb.findOne({ _id: id }); //find product by user login id
        const carts = await cartsDB.findOne({ userid: req.userId, productid: productfind._id, });

        if (!carts) {
            res.status(400).json({ error: "carts not found" })
        }

        const removeCartItem = await cartsDB.findByIdAndDelete({_id:carts._id});
        
        //product increment
        productfind.quantity = productfind.quantity + carts.quantity;
        await productfind.save();

        res.status(200).json({massege:"Your Item Successfully Remove From Your Card",removeCartItem});

    } catch (error) {
        res.status(400).json(error)
    }
}

//remove cart data when order done
exports.deleteCartData = async(req, res)=>{

    try {
        const deletecarts = await cartsDB.deleteMany({userid:req.userId});
        res.status(200).json(deletecarts)
    } catch (error) {
        res.status(400).json(error)
    }
}