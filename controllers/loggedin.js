const db = require("../routes/db-config");
const jwt = require("jsonwebtoken");
const loggedIn = (req, res, next)=>{
    const userRegistered = req.cookies.userRegistered;
    console.log('Cookies:', req.cookies);
    console.log('Session:', req.session);
    if(!req.cookies.userRegistered) return next();
    try
    {
        const decoded = jwt.verify(req.cookies.userRegistered, process.env.JWT.SECRET);
        db.query("SELECT * FROM users WHERE id=?", [decoded.id], (err, result)=>{
            if(err) return next();
            req.session.user = result[0];
            return next();
        })
    }
    catch(err)
    {
        if(err) return next();
    }
}
module.exports = loggedIn;