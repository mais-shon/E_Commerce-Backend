import Category_UserModel from "../../../../DB/model/Category_User.model.js";
import userModel from "../../../../DB/model/user.model.js";
import { compare, hash } from "../../../Services/hashAndCompare.js";
import cloudinary from "../../../Services/cloudinary.js";
import { generateToken } from "../../../Services/generateAndVerifyToken.js";
import { sendEmail } from "../../../Services/sendEmail.js";

//return stakeHolder that linked with spicific category
export const getstakeHolder = async (req, res, next) => {
  const { categoryId } = req.params;
  const category = await Category_UserModel.findOne({ categoryId });
  if (!category) {
    return next(new Error(`there is no stores yet`), { cause: 404 });
  }
  const stores = await userModel.find({ categoryId, status: 'active' });
  return res.json(stores);
}
export const profilePic = async (req, res, next) => {
  const userId = req.user._id;
  const user = await userModel.findOne({ _id: userId, role: 'stakeHolder' });
  if (!user) {
    return next(new Error('Invalid user id or user not found', { status: 400 }));
  }
  if (!req.file) {
    return next(new Error('Sorry, you need to insert your picture', { cause: 400 }));
  }
  const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/user/profilePic` });
  user.profilePic = { public_id, secure_url };
  const newUser = await user.save();
  return res.json({ message: 'Profile picture updated successfully', newUser });
}
// Bio 
export const Bio = async (req, res, next) => {
  const userId = req.user._id;
  const role = req.user.role;
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new Error('invalid user id', { cause: 400 }));
  } else
    if (role !== "stakeHolder") {
      return next(new Error(`you cant put any profilPic`), { cause: 401 });
    }
  if (!req.body.Bio) {
    return res.status(400).json({ message: 'Bio cannot be empty' });
  }
  if (req.body.Bio) {
    if (user.Bio == req.body.Bio) {
      return next(new Error('new Bio like the same with old Bio', { cause: 409 }));
    } if (!req.Bio === null) {
      return next(new Error('Bio cant be null', { cause: 409 }));
    }
    user.Bio = req.body.Bio;
    await user.save();
    return res.status(200).json({ message: "success", user });
  }
}
//soft delete user from admin
export const softDeleteUser = async (req, res, next) => {
  const { userId } = req.params;
  const user = await userModel.findOne({ _id: userId, status: 'active' });
  if (!user) {
    return next(new Error(`this user not fount`, { cause: 400 }));
  }
  user.status = 'not active';
  user.save();
  return res.status(200).json({ message: "success", user });
}
//get soft delete  user
export const getSofDeletetuser = async (req, res, next) => {
  const softuser = await userModel.find({ status: 'not active' });
  if (!softuser) {
    return next(new Error(`there no soft deleted user`, { cause: 400 }));
  }
  return res.json({ message: "success", softuser });
}
// update basic information
export const updateInfo = async (req, res, next) => {
  const userId = req.user._id;
  const user = await userModel.findById(userId);
  if (!user || user.status == 'not active') {
    return next(new Error(`invalid user`, { cause: 404 }));
  }
  let { firstName, lastName, email, password, address, phone, newPassword, confirmNewPassword } = req.body;
  const match = compare(password, user.password);
  if (!match) {
    return next(new Error(`invalid password`));
  }
  if (email) {
    if (user.email == email) {
      return next(new Error(`new email same as old one`));
    }
    if (await userModel.findOne({ email })) {
      return next(new Error(`duplicate email`, { cause: 409 }));
    }
    user.email = email;
    user.confirmEmail = false;
    const token = generateToken({ email }, process.env.SIGNUP_TOKEN);
    const rtoken = generateToken({ email }, process.env.SIGNUP_TOKEN, 24 * 60 * 60);
    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
    const Rlink = `${req.protocol}://${req.headers.host}/auth/NewconfirmEmail/${rtoken}`;
    const html = `<a href="${link}"> vefiy your email</a> <br/> <br/> <a href="${Rlink}">  new vefiy your email</a> `;
    await sendEmail(email, `confirm email`, html);
  }
  if (firstName) {
    user.firstName = firstName;
  }
  if (lastName) {
    user.lastName = lastName;
  }
  if (address) {
    user.address = address;
  }
  if (phone) {
    user.phone = phone;
  }
  if (newPassword) {
    if (!confirmNewPassword) {
      return next(new Error(`confirm password is required`));
    }
    match = compare(newPassword, user.password);
    if (match) {
      return next(new Error(`new password match old one`));
    }
    user.password = hash(newPassword);
  }
  await user.save();
  return res.json({ message: "success" });
}
export const getAllUsers=async(req,res,next)=>{
  let users=await userModel.find();
  return res.status(200).json({message:"success",users})
  }
