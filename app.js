require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('./routes/db-config');
const login = require('./controllers/login'); // Import the login controller
const register = require('./controllers/register');
const loggedIn = require("./controllers/loggedin");

const cookieParser = require('cookie-parser');
const bcrypt = require("bcryptjs");
const app = express();

const PORT = process.env.PORT || 3000;





// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'gd34389sndmas832',
    resave: false,
    saveUninitialized: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log('Session:', req.session);
    next();
});

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
}

// Middleware to check admin role
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Access denied: Admins only');
}

// Routes
app.get("/", loggedIn, (req,res)=>{
    // const id = req.session.user.id;
    if(req.session.user){
      res.render("home", {status:"loggeddIn", user:req.session.user});
      console.log(loggedIn);
    }
    else{
      res.render("home", {status:"no", user:"nothing"});
      console.log(loggedIn);
    }
   
  });

app.get('/login', (req, res) => {
    res.render('login');
});

// router.post("/login", login);

app.post('/login', login);

app.get('/loggedin', loggedIn);

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', register);

app.get('/admin', isAuthenticated, isAdmin, (req, res) => {
    // res.render('admin', { username: req.session.user.username });
    const adminId = req.session.user.id;

    

    db.query('SELECT * FROM users WHERE role=?',['user'], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching users");
        }
        // Render the admin view with user data
        res.render('admin', { username: req.session.user.username, users: results });
       
    });

    
});


app.get('/admin/profile', isAuthenticated, isAdmin, (req, res) => {
    const adminId = req.session.user.id; // Assuming the admin ID is stored in the session

    db.query('SELECT * FROM users WHERE id = ?', [adminId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching admin profile");
        }

        if (results.length === 0) {
            return res.status(404).send("Admin not found");
        }

        const adminProfile = results[0];

        // Render the profile view with admin data
        res.render('adminProfile', { admin: adminProfile });
    });
});


app.get('/user/profile', isAuthenticated, (req, res) => {
    const userId = req.session.user.id; // Assuming the admin ID is stored in the session

    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching user profile");
        }

        if (results.length === 0) {
            return res.status(404).send("Admin not found");
        }

        const userProfile = results[0];

        // Render the profile view with admin data
        res.render('userProfile', { user: userProfile });
    });
});

app.get('/profile/:id',(req, res) => {
    const id = req.session.user.id; // Assuming the admin ID is stored in the session

    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching admin profile");
        }

        if (results.length === 0) {
            return res.status(404).send("Page not found");
        }

        const profile = results[0];

        // Render the profile view with admin data
        res.render('profile', { user: profile });
    });
});

// Route to render edit user form
app.get('/admin/edit/:id', isAuthenticated, isAdmin, (req, res) => {
    const userId = req.params.id;

    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching user details");
        }

        if (results.length === 0) {
            return res.status(404).send("User not found");
        }

    

        res.render('edit', { user: results[0] });
    });
});

// Route to update user details
app.post('/admin/edit/:id', isAuthenticated, isAdmin, (req, res) => {
    const userId = req.params.id;
    const { username, role } = req.body;

    db.query('UPDATE users SET username = ?, role = ? WHERE id = ?', [username, role, userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error updating user details");
        }

        res.redirect('/admin'); // Redirect back to admin page
    });
});



app.get('/user', isAuthenticated, (req, res) => {
    res.render('user', { username: req.session.user.username });
});

// Route to render change password form
app.get('/change-password', isAuthenticated, (req, res) => {
    res.render('changePassword', { username: req.session.user.username });
});

app.post('/change-password', isAuthenticated, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    db.query('SELECT * FROM users WHERE id = ?', [req.session.user.id], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching user details");
        }

        if (results.length === 0) {
            return res.status(404).send("User not found");
        }

        const user = results[0];

        // Compare the current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.json({ status: "error", error: "Current password is incorrect" });
        }

        // Hash the new password and update it
        const hashedNewPassword = await bcrypt.hash(newPassword, 8);
        db.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, user.id], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error updating password");
            }
            req.session.destroy();
            res.redirect('/login'); // Redirect to home or another page
        });
    });
});


// Route to get user profile
app.get('/admin/profile/:id', isAuthenticated, isAdmin, (req, res) => {
    const userId = req.params.id;

    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching user profile");
        }
        
        if (results.length === 0) {
            return res.status(404).send("User not found");
        }

        // Render the profile view with user data
        res.render('profile', { user: results[0] });
    });
});

app.get('/profile/:id', isAuthenticated, (req, res) => {
    const userId = req.params.id;

    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error fetching user profile");
        }
        
        if (results.length === 0) {
            return res.status(404).send("User not found");
        }

        // Render the profile view with user data
        res.render('profile', { user: results[0] });
    });
});



app.post('/admin/delete/:id', isAuthenticated, isAdmin, (req, res) => {
    const userId = req.params.id;

    db.query('DELETE FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error deleting user");
        }

        // Redirect back to admin page after deletion
        res.redirect('/admin');
    });
});



app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.redirect('/');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
