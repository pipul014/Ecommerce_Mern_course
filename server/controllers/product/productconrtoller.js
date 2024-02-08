const categorydb = require("../../model/product/productCategoryModel");
const cloudinary = require("../../cloudinary/cloudinary");
const productsdb = require("../../model/product/productmodel");
const productreviewdb = require("../../model/product/productReviewModel");


//Addcategory
exports.AddCategory = async (req, res) => {

    const { categoryname, description } = req.body

    if (!categoryname || !description) {
        res.status(400).json({ error: "fill all details" })
    }

    try {
        const existingcategory = await categorydb.findOne({ categoryname: categoryname })

        if (existingcategory) {
            res.status(400).json({ error: "this is category already exist" })
        } else {
            const addCategory = new categorydb({
                categoryname, description
            })
            await addCategory.save()
            res.status(200).json(addCategory)
        }

    } catch (error) {
        res.status(400).json(error)
    }

}

// Getcategory
exports.Getcategory = async (req, res) => {

    try {

        const getAllCategory = await categorydb.find();
        res.status(200).json(getAllCategory);

    } catch (error) {
        res.status(400).json(error)
    }
}

//Add products 
exports.Addproduct = async (req, res) => {
    const { categoryid } = req.query;
    const file = req.file ? req.file.path : ""

    const { productname, price, discount, quantity, description } = req.body;

    if (!productname || !price || !discount || !quantity || !description || !file) {
        res.status(400).json({ error: "all filed required" })
    }

    try {
        const upload = await cloudinary.uploader.upload(file);
        const existingproduct = await productsdb.findOne({ productname: productname })
        if (existingproduct) {
            res.status(400).json({ error: "This Product Already Exist" })
        } else {
            const addProduct = new productsdb({
                productname, price, discount, quantity, description, categoryid, productimage: upload.secure_url
            });
            await addProduct.save();
            res.status(200).json(addProduct);

        }


    } catch (error) {
        res.status(400).json(error)
    }
}

//Get All Products
exports.GetAllProducts = async (req, res) => {
    const categoryid = req.query.categoryid || ""

    const page = req.query.page || 1;
    const ITEM_PER_PAGE = 8;

    const query = {}
    if (categoryid !=="all" && categoryid) {
        query.categoryid = categoryid
    }


    try {

        const skip = (1 - 1) * ITEM_PER_PAGE;

        //count products
        const count = await productsdb.countDocuments(query);



        const getAllProducts = await productsdb.find(query)
            .limit(ITEM_PER_PAGE)
            .skip(skip);

        const pageCount = Math.ceil(count / ITEM_PER_PAGE);

        res.status(200).json({
            getAllProducts,
            pagination: {
                totalProducts: count, pageCount
            }
        });
    } catch (error) {
        res.status(400).json(error)
    }
}

//get single product suing productid
exports.getSingleProduct = async(req,res)=>{
    const {productid} = req.params;

    try {
        const getSingleProduct = await productsdb.findOne({_id:productid})
        res.status(200).json(getSingleProduct);

    } catch (error) {
        res.status(400).json(error)
    }
}

//get letest products
exports.getLetestProducts = async(req,res)=>{

    try {
        const getNewProducts = await productsdb.find()
        .sort({_id:-1});
        res.status(200).json(getNewProducts);

    } catch (error) {
        res.status(400).json(error)
    }
}

//delete product
exports.deleteProducts = async(req,res)=>{
    const {productid} = req.params;
    try {

        const deleteProduct = await productsdb.findByIdAndDelete({_id:productid});
        res.status(200).json(deleteProduct)
        
    } catch (error) {
        res.status(400).json(error)
    }
}

//product review api
exports.productReviews = async(req, res)=>{
    const {productid} = req.params;
    const {username, rating, description} = req.body;
    if(!username || !rating || !description || !productid){
        res.status(400).json({massege:"all input pilled are require"});

    }
    try {
        const productreviewed = new productreviewdb({
            userid:req.userMainId,productid,username, rating, description
         });
         await productreviewed.save();
         res.status(200).json(productreviewed)

    } catch (error) {
        res.status(400).json(error)
    }
}

//getProductReviews
exports.getProductReviews = async(req, res)=>{
    const{productid} = req.params;
    try {
        const getproductreview = await productreviewdb.find({productid : productid});
        res.status(200).json(getproductreview)

    } catch (error) {
        res.status(400).json(error)
    }
}

//deleteProductReviews
exports.deleteProductReviews = async(req,res)=>{
    const {reviewid} = req.params;

    try {
        const deletereview = await productreviewdb.findByIdAndDelete({_id:reviewid});
        res.status(400).json(deletereview);
        
    } catch (error) {
        res.status(400).json(error)
    }
}
