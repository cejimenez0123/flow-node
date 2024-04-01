const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session")
const bodyParser = require("body-parser")
const passport = require("passport")
const cors = require('cors')
const authRoutes = require('./routes/auth.js')
const forkRoutes = require('./routes/fork.js')
const userRoutes = require('./routes/user.js')
const {setUpPassportLocal}= require("./middleware/authMiddleware.js")

dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
const logger = (req, _res, next) => {
    const time = new Date().toLocaleTimeString();
    console.log(`${time} ${req.method}: ${req.url}`);
    next();
    };
const authMiddleware = passport.authenticate('bearer', { session: false }); // Sessionless authentication

app.use(bodyParser.json());
app.use(logger);
app.get('/', (req, res, next) => {

    res.status(200).json({message:"Hello World"})
})
app.use("/user", userRoutes(authMiddleware))
app.use("/auth", authRoutes(authMiddleware));
app.use("/fork",forkRoutes(authMiddleware))
setUpPassportLocal(passport);
app.use(
    session({
    secret: process.env.JWT_SECRET,resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Adjust this based on you
    }))
app.use(passport.session());
app.use(passport.initialize());
app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`)
})
module.exports = app