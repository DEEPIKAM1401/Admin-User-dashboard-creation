const db = require("../routes/db-config");
const bcrypt = require("bcryptjs");
const path =require("path");

const register = async (req, res) => {
    const { username, password:Npassword, role } = req.body;

    console.log("Got value:"+username+Npassword+role);

    if (!username || !Npassword || !role) {
        return res.json({ status: "error", error: "Please Enter your email and password and role" });
    }
    
    db.query('SELECT username FROM users WHERE username = ?', [username], async (err, result) => {
        if (err) throw err;
        if (result[0]) return res.json({ status: "error", error: "Email has already been registered" });
        else {
            const hashedPassword = await bcrypt.hash(Npassword, 8);
            db.query('INSERT INTO users SET ?', {
                username: username,
                password: hashedPassword,
                role: role,
            }, (error, results) => {
                if (error) throw error;
                return res.json({ status: "success", success: "User has been registered" });
                // return res.status(201).send("User has been registered");
                // return res.send("<h1>User has been registered</h1>");
            });
        }
    });
}


module.exports = register;