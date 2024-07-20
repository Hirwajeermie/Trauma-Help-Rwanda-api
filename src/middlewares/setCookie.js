import setTokenCookie from "../utils/setTokenCookie";




const setCookie = (req, res, next) => {
    console.log('Cookies received:', req.cookies); 
  
    const token = req.cookies?.token;
  
    if (token) {
      setTokenCookie(res, token);
    } else {
      console.log('No token found in cookies');
    }
    next();
  };
  
  export default setCookie;
