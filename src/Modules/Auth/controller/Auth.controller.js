import userModel from "../../../../DB/model/User.model.js";
import { generateToken, verifyToken } from "../../../Services/generateAndVerifyToken.js";
import { compare, hash } from "../../../Services/hashAndCompare.js";
import { sendEmail } from "../../../Services/sendEmail.js";
import Category_UserModel from "../../../../DB/model/Category_User.model.js";
import categoryModel from "../../../../DB/model/Category.model.js";
//SignUp
export const signUp = async (req, res, next) => {
    const { firstName, lastName, address, phone, email, password, role } = req.body;
    const exist = await userModel.findOne({ email });
    if (exist) {
        return next(new Error('this user already exist'), { cause: 409 });
    }
    if (req.body.role == 'Guest' || req.body.role == 'Admin') {
        return next(new Error('sorry,you cant signUp'), { cause: 400 });
    }
    const hashPassword = hash(password);
    const token = generateToken({ email, role }, process.env.SIGNUP_TOKEN, 60 * 10);//security and usability
    const refreshToken = generateToken({ email, role }, process.env.SIGNUP_TOKEN, 60 * 60 * 24);
    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
    const Rlink = `${req.protocol}://${req.headers.host}/auth/NewconfirmEmail/${refreshToken}`;
    const html = `<a href="${link}"> vefiy your email</a> <br/> <br/> <a href="${Rlink}">  new vefiy your email</a> `;
    await sendEmail(email, `confirm email`, html);
    if (req.body.role == 'stakeHolder') {
        const { categoryName } = req.body;
        const category = await categoryModel.findOne({ name: categoryName });
        if (!category)
            return next(new Error('sorry,you cant be in this category'), { cause: 400 });
        if (!req.body.lastName) {
            const createUSer = await userModel.create({ role, firstName, lastName, address, phone, categoryName, email, password: hashPassword, categoryId: category._id });
            const Category_USer = await Category_UserModel.create({ categoryId: category._id, userId: createUSer._id });
            return res.status(201).json({ message: "success", user: createUSer._id });
        } else {
            const createUSer1 = await userModel.create({ role, firstName, lastName, address, phone, categoryName, email, password: hashPassword, categoryId: category._id });
            const Category_USer = await Category_UserModel.create({ categoryId: category._id, userId: createUSer1._id });
            return res.status(201).json({ message: "success", user: createUSer1._id });
        }
    }
    if (req.body.lastName == null) {
        return next(new Error(`you need to enter your lastName`), { cause: 400 });
    }
    const createUSers = await userModel.create({ firstName, lastName, address, phone, email, password: hashPassword, role });
    return res.status(201).json({ message: "success", user: createUSers._id });
}
export const confirmEmail = async (req, res,next) => {
    const { token } = req.params;
    const decoded = verifyToken(token, process.env.SIGNUP_TOKEN);
    if (!decoded?.email) {
        return next(new Error("invalid token payload", { cause: 400 }));
    }
    let user = await userModel.updateOne({ email: decoded.email }, { confirmEmail: true });
    if (user.modifiedCount) {
        return res.status(200);
    } else
        return next(new Error("your email is verfy"));
}
export const NewconfirmEmail = async (req, res,next) => {
    let { token } = req.params;
    const decoded = verifyToken(token, process.env.SIGNUP_TOKEN);
    if (!decoded.email) {
        return next(new Error("invalid token payload", { cause: 400 }));
    }
    const user = await userModel.findOne({ email });
    if (!user) {
        return next(new Error("not register account", { cause: 400 }));
    }
    if (user.confirmEmail) {
        return res.status(200).redirect(`${process.env.FE_URL}`);
    }
    token = generateToken({ email }, process.env.SIGNUP_TOKEN, 60 * 10);
    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
    const html = `<a href="${link}"> vefiy your email</a>`;
    await sendEmail(email, `confirm email`, html);
    return res.status(200).json(`<p>new confirm email send to your inbox</p>`);

}
//signIn
export const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return next(new Error("in valid sign in data", { cause: 404 }));
    } else {
        if (!user.confirmEmail) {
            return next(new Error("plz verify your email", { cause: 400 }));
        }
        if (user.status == 'not active') {
            return next(new Error(`not active profile`));
        }
        const match = compare(password, user.password);
        if (!match) {
            return next(new Error("invalid log in data", { cause: 400 }));
        } else {
            const token = generateToken({ id: user._id, role: user.role }, process.env.LOGIN_TOKEN, '3h');//security
            const refreshToken = generateToken({ id: user._id, role: user.role }, process.env.LOGIN_TOKEN, 60 * 60 * 24 * 10);
            return res.status(200).json({ message: "Done", token, refreshToken });
        }
    }
}






