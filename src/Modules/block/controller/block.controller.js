import { blockModel } from "../../../../DB/model/block.model.js";
import userModel from "../../../../DB/model/user.model.js";

//stakeholder  block customere
export const createBlock = async (req, res, next) => {
    const { customerId } = req.params;
    if (!await userModel.findOne({ _id: customerId, status: 'active', role: 'Customer' })) {
        return next(new Error(`invalid customer account`, { cause: 404 }));
    }
    const stockholderId = req.user._id;
    if (!await userModel.findOne({ _id: stockholderId, status: 'active', role: 'stakeHolder' })) {
        return next(new Error(`invalid operation`));
    }
    if (await blockModel.findOne({ customerId, stockholderId })) {
        return next(new Error(`you already blocked this account`));
    }
    const block = await blockModel.create({ customerId, stockholderId });
    return res.status(201).json({ message: "success" });
}
//remove block
export const deleteBlock = async (req, res, next) => {
    const { customerId } = req.params;
    if (!await userModel.findOne({ _id: customerId, status: 'active', role: 'Customer' })) {
        return next(new Error(`invalid customer account`, { cause: 404 }));
    }
    const stockholderId = req.user._id;
    if (!await userModel.findOne({ _id: stockholderId, status: 'active', role: 'stakeHolder' })) {
        return next(new Error(`invalid operation`));
    }
    if (!await blockModel.findOne({ customerId, stockholderId })) {
        return next(new Error(`no block found`));
    }
    const block = await blockModel.findOneAndDelete({ customerId, stockholderId });
    return res.json({ message: "success" });
}