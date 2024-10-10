const db = require('../routes/db-config'); // Adjust the path according to your project structure
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';

    db.execute(query, [username], async (err, results) => { // Note the async here
        if (err) {
            console.error("Database error:", err);
            return res.json({ status: "error", error: "Database error" });
        }

        // Check if the user exists and the password matches
        if (!results.length || !(await bcrypt.compare(password, results[0].password))) {
            return res.json({ status: "error", error: "Incorrect username or password" });
        }

        const user = results[0];

        // Generate a JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES
        });

        // Cookie options
        const cookieOptions = {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        // Set the cookie with the token
        res.cookie("userRegistered", token, cookieOptions);

        // Store user session info
        req.session.user = { id: user.id, username: user.username, role: user.role };

        // Redirect based on user role
        return res.redirect(user.role === 'admin' ? '/admin' : '/user');
    });
};

module.exports = login;
