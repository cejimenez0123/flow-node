const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require("../db")

// module.exports = function (passport){
const router = express.Router()

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Validate input and ensure uniqueness
      if (!email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: 'email already exists' });
      }
  
      // Hash password securely (at least 10 rounds)
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user in Prisma
      const user = await prisma.user.create({
        data: { email, password: hashedPassword },
      });
  
      // Optionally generate a JWT token (avoid storing full credentials in token)
      // and send it as a response (not in body for security)
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(201).json({ message: 'User registered successfully', token }); // Securely send token in header
    } catch (error) {
      console.error(error); // Log error for debugging
      res.status(500).json({ message: 'Registration failed' });
    }
  });

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find user by username
      const user = await prisma.user.findUnique({ where: { email } });
  
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Generate JWT token with user ID
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '3h' }); // Adjust expiration as needed
  
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in' });
    }
  });
// router.post("/login",(req, res) => { passport.authenticate("local", passport.authenticate("local",(err, user, options) => {
//     if (user) {
        // req.login(user, (error)=>{
        //     if (error) {
        //         res.send(error);
        //     } else {
        //         let token = generateToken(user.id)
        //         console.log("Successfully authenticated");
        //         res.json({user:user,token:token});
        //     };
        // });
//     } else {
//         console.error(err); 
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// })(req, res))})

// router.post("/logout", async function (req, res, next) {
//         req.logout(function (err) {
//         if (err) {
//             console.error(err); 
//         return next(err);
//         }
//         console.log("Successfully logged out")
//         res.redirect("/login");
//         });
//     })
//         return router
// }
router.post("/logout", async function (req, res, next) {

})
module.exports = router