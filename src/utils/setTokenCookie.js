import 'dotenv/config'
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true, 
    sameSite: 'strict', 
  });
};

export default setTokenCookie;