const Category = require("../models/category")

exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, cate) => {
        if (err) return res.status(400).json({ error: "Category not found" })
        req.category = cate;
        next();
    })
}

exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save((err, cate) => {
        if (err) return res.status(400).json({ error: "Not able to save category in DB" })
        res.json({ cate });

    })
}


exports.getCategory = (req, res) => {
    return res.json(req.category)

}

exports.getAllCategory = (req, res) => {
    Category.find().exec((err, items) => {
        if (err) return res.status(400).json({ error: "Not categories found" })

        res.json(items);

    })
}

exports.updateCategory = (req, res) => {
    // Category.findByIdAndUpdate(
    //     { _id: req.category._id },
    //     { $push: { name: req.body.name } },
    //     { new: true, useFindAndModify: false },
    //     (err, category) => {
    //         if (err) {
    //             return res.status(400).json({
    //                 error: "Unable to change category"
    //             });
    //         }
    //         res.json(category)

    //     }
    // );
    const category = req.category
    category.name = req.body.name
    category.save((err, category) => {
        if (err) return res.status(400).json({ error: "Cannot update category" })
        res.json(category)
    })
}

exports.removeCategory = (req, res) => {
    const category = req.category;
    category.remove((err, category) => {
        if (err) {
            return res.status(400).json({
                error: "failed to delete category"
            });
        }
        res.json({
            message: "category succesfully deleted"
        })

    })
}