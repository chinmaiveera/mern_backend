const Product = require("../models/product")
const formidable = require("formidable")
const _ = require("lodash")
const fs = require("fs")
const product = require("../models/product")
exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
        .populate("category")
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "product not found"
                });
            }
            req.product = product
            //console.log(product);
            next();
        })
}


exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "problem creating product"
            });
        }


        const { name, description, price, category, stock } = fields;
        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ) {
            return res.status(400).json({
                error: "please include all details of product"
            });

        }

        let product = new Product(fields);

        if (file.photo) {
            if (file.photo.size > 3 * 1024 * 1024) {
                return res.status(403).json({
                    error: "file size too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type
        }

        product.save((err, product) => {
            if (err) {
                res.status(400).json({
                    error: "Saving tshirt in DB failed"
                })
            }
            res.json(product);
        })

    })
};





exports.getProduct = (req, res) => {
    let product = req.product;
    product.photo = undefined;
    return res.json(product)
}

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}


//deletion

exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to delete the product"
            })
        }
        res.json({
            message: "deletion successfull"
        })
    })
}

exports.updateProduct = (req, res) => {
    let form = formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "problem creating product"
            });
        }

        let product = req.product;
        product = _.extend(product, fields);

        if (file.photo) {
            if (file.photo.size > 3 * 1024 * 1024) {
                return res.status(403).json({
                    error: "file size too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type
        }

        product.save((err, product) => {
            if (err) {
                res.status(400).json({
                    error: "Updation failed"
                })
            }
            res.json(product);
        })

    })

}

exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? req.query.limit : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find()
        .select("-photo")
        .populate("category")
        .limit(limit)
        .sort([[sortBy, "asc"]])
        .exec((err, productList) => {
            if (err) return res.status(400).json({
                error: "error in getting allProducts"
            })
            console.log(`get all products ${productList}`);
            res.json(productList);

        })



}

exports.updateStock = (req, res, next) => {
    let myOperations = req.body.order.product.map(prod => {
        return {
            updateOne: {
                filter: { _id: prod._id },
                update: { $inc: { stock: -prod.count, sold: +prod.count } }

            }
        }
    })

    Product.bulkWrite(myOperations, {}, (err, product) => {
        if (err) {
            return res.status(400).json({
                error: "error in updating stock"
            })
        }
    })

}

exports.getAllUniqueCatogeries = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if (err) {
            res.send(400).json({
                error: `cannot get alluniquecatogeries ${process.cwd()}`
            })
        }
        res.json(category);
    })

}