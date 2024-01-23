import userModel from "../../DB/model/User.model.js";
import { asyncHandler } from "../Services/errorHandling.js";
import { verifyToken } from "../Services/generateAndVerifyToken.js";
export const roles = {
  Admin: 'Admin',
  Customer: 'Customer',
  Guset: 'Guset',
  stakeHolder: 'stakeHolder'
};
//authrization هو الي بحدد صلاحية الادمن مثلا غير عن اليوزر العادي وهكذا 
//authorization بشكل عام هاد الانسان عامل تسجيل دحول والو توكين ولا لا
export const auth = (accessRoles = []) => {
  return asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization?.startsWith(process.env.BEARERKEY)) {
      return next(new Error(`invalid token `, { cause: 400 }));
    }
    const token = authorization.split(process.env.BEARERKEY)[1];
    if (!token) {
      return next(new Error(`invlid token`, { cause: 400 }));
    }
    const decoded = verifyToken(token, process.env.LOGIN_TOKEN);
    if (!decoded) {
      return next(new Error(`invlid token payload`, { cause: 400 }));
    }
    const user = await userModel.findById(decoded.id).select('_id userName role changePasswordTime');//هيك حددت انو جبلي من الداتا بيس اسم اليوزر والرول تبعته
    if (!user) {
      return next(new Error(`invlid user`, { cause: 401 })) ;//يعني يوزر كان معه التوكن ونحذفت وبطل يوزر عندي
    }
    if (!accessRoles.includes(user.role)) {
      return next(new Error(`invlid token payload`, { cause: 403 }));
    }
    req.user = user;
    next();
  })
}
