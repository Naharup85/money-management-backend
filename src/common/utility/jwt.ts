import {createHmac,randomBytes} from "node:crypto"
import ApiError from "../../common/utility/apiErrors.js";


const genrateToken=()=>{
    const token=randomBytes(32).toString("hex");
    const hashToken= createHmac("sha256",token).digest("hex");
    return {token,hashToken}
}




export{
    genrateToken,
   
}
