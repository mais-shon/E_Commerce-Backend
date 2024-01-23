import * as dotenv from 'dotenv';
dotenv.config();
import cloudinary from 'cloudinary';
cloudinary.v2.config({ 
  cloud_name: 'dtbz01aii', 
  api_key:'785912915629283', 
  api_secret: 'Asq-o0io85UmV7scP4qv26Rb7XQ' 
  });
  export default cloudinary.v2;