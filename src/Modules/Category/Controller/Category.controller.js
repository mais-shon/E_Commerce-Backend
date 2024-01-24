import categoryModel from "../../../../DB/model/Category.model.js";
import Category_UserModel from "../../../../DB/model/Category_User.model.js";
import slugify from "slugify";


//createCategory
export const createCategory = async (req, res, next) => {
    const name = req.body.name;
    const slug = slugify(name, '-');
    if (await categoryModel.findOne({ name })) {
        return next(new Error('cant duplicate category name'), { cause: 409 });
    }
    const category = await categoryModel.create({ name, slug });
    return res.json({ message: "success", category });
}
//update category
export const updateCategory = async (req, res, next) => {
    const { categoryId } = req.params;
    const category = await categoryModel.findById(categoryId);
    if (!category) {
        return next(new Error('cant found this category', { cause: 400 }));
    }
    if (category.name == req.body.name) {
        return next(new Error('this is the category name already'), { cause: 409 });
    } else if (await categoryModel.findOne({ name: req.body.name })) {
        return next(new Error('this is the name of another category ,sorry cant duplicate', { cause: 409 }));
    }
    category.name = req.body.name;
    category.slug = slugify(req.body.name);
    await category.save();
    return res.status(200).json({ message: 'success', category });
}
//get all category
export const getAllCategory = async (req, res, next) => {
    const allCategory = await categoryModel.find({}, 'name');
    return res.status(200).json({ message: "success", allCategory });
}
//getspecificCategory
export const getSpecificCategory = async (req, res, next) => {
    const { categoryId } = req.params;
    const category = await categoryModel.findById(categoryId);
    if (!category) {
        return next(new Error("this category unavailable", { cause: 404 }));
    }
    return res.status(200).json({ message: 'success', category });
}
//delete category
export const deleteCategory = async (req, res, next) => {
    const { categoryId } = req.params;
    const category = await Category_UserModel.findOne({ categoryId });
    if (category) {
        return next(new Error(`sorry,you cant delete this catgeory any more`, { cause: 400 }));
    }
    await categoryModel.deleteOne({ _id: categoryId });
    return res.status(200).json({ message: 'success' });
}

