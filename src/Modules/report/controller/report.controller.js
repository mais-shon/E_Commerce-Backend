import productModel from "../../../../DB/model/product.model.js";
import { productReportModel } from "../../../../DB/model/productReport.model.js";
import { reportModel } from "../../../../DB/model/report.model.js";
import userModel from "../../../../DB/model/User.model.js";

export const createReportStockholder = async(req,res,next)=>{
    const {stockholderId}=req.params;
    if(!await userModel.findOne({_id:stockholderId,status:'active',role:'stakeHolder'})){
        return next(new Error(`invalid stockholder account`));
    }
    const customerId = req.user._id;
    if(!await userModel.findOne({_id:customerId,status:'active',role:'Customer'})){
        return next(new Error(`invalid operation`,{cause:404}));
    }
    if(await reportModel.findOne({stockholderId,customerId})){
        return next(new Error(`you already reported this account`));
    }
    const {note} = req.body;
    const report = await reportModel.create({stockholderId,customerId,note});
    return res.status(201).json({message:"success"});
}
export const getStockholdersReports = async(req,res,next)=>{
    const reports =await reportModel.find();
    if(reports.length==0){
        return next(new Error(`no reports Found`));
    }
    return res.json({message:"success",reports});
} 
export const createReportProduct =async(req,res,next)=>{
    const {productId} = req.params;
    const product = await productModel.findOne({_id:productId,deletedAt:false});
    if(!product){
        return next(new Error(`product not found`,{cause:404}));
    }
    const stockholderId = product.createdBy;
    const customerId = req.user._id;
    if(!await userModel.findOne({_id:customerId,role:'Customer',status:'active'})){
        return next(new Error(`invalid operation`));
    }
    if(await productReportModel.findOne({customerId,productId})){
        return next(new Error(`you already report this product`));
    }
    const {note}=req.body;
    const report = await productReportModel.create({customerId,productId,stockholderId,note});
    return res.status(201).json({message:"success"});
}
export const getProductsReportedForSpecificStockholder =async(req,res,next)=>{
    const user = req.user;
    let  id;
    if(user.role=='Admin'){
        const{stockholderId}=req.params;
        if(!await userModel.findOne({_id:stockholderId,role:'stakeHolder'})){
            return next(new Error(`stockholder not found`,{cause:404}));
        }
        id=stockholderId;
    }else if(user.role == 'stakeHolder'){
        if(!await userModel.findOne({_id:user._id,role:'stakeHolder'})){
            return next(new Error(`invalid operation`));
        }
        id=user._id;
    }
    const reports = await productReportModel.find({stockholderId:id}).select('productId');
    let products=[];
    for(let report of reports){
        const product = await productModel.findById(report.productId);
        products.push(product);
    }
    return res.json({message:"success",products});
}
export const getReportsForSpecificProduct = async(req,res,next)=>{
    const user = req.user;
    const{productId}=req.params;
    if(user.role == 'stakeHolder'){
        const product = await productModel.findOne({_id:productId,createdBy:user._id});
        if(!product){
            return next(new Error(`invalid operation`));
        }
    }
    const reports = await productReportModel.find({productId});
    if(reports.length==0){
        return next(new Error(`no reports for this product`));
    }
    return res.json({message:"success",reports});
}
