const LocalStrategy = require("passport-local");
const prisma = require("../db");
const BearerStrategy = require('passport-http-bearer').Strategy;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
function setUpPassportLocal(passport){
passport.use(new BearerStrategy(async (token, done) => {
  try {
    // Verify token authenticity and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch user data from Prisma
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return done(null, false); // Invalid token or user not found
    }

    // Optionally verify password (if hashed)
    // if (user.password && passwordHashingUsed) {
    //   const isMatch = await bcrypt.compare(password, user.password);
    //   if (!isMatch) {
    //     return done(null, false); // Invalid credentials
    //   }
    // }

    // Pass authenticated user object to next middleware
    done(null, user);
  } catch (error) {
    done(error); // Handle errors gracefully
  }
}))
passport.serializeUser((user, done) => {
  done(null, user.id); // Store only user ID in session (important for CSRF protection)
});

passport.deserializeUser((id, done) => {
  prisma.user.findUnique({ where: { id } }) // Fetch user data from DB
    .then(user => done(null, user))
    .catch(error => done(error));
});

}
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using JWT secret

//     const user = await prisma.user.findUnique({ // Check if user exists with the decoded ID
//       where: { id: decoded.id },
//     });

//     if (!user) {
//       return done(null, false); // User not found or invalid token
//     }

//     // Attach user object to request for use in protected routes
//     done(null, user);
//   } catch (error) {
//     done(error); // Handle errors appropriately
//   }
// }));
// passport.serializeUser((user, done) => {
//   done(null, user.id); // Store only user ID in session
// });

// passport.deserializeUser((id, done) => {
//   prisma.user.findUnique({ where: { id } }) // Fetch user data from DB
//     .then(user => done(null, user))
//     .catch(error => done(error));
// });

  // new BearerStrategy(
  //   function(token, done) {
  //     User.findOne({ token: token }, function (err, user) {
  //       if (err) { return done(err); }
  //       if (!user) { return done(null, false); }
  //       return done(null, user, { scope: 'all' });
  //     });
  //   }
  // )
  
  
  
  
//   passport.use( new LocalStrategy.Strategy({
//     usernameField: "email",
//     passwordField: "password",
// },async function (email, password, done) {
//     try {
//       // Find user by email
//       const user = await prisma.user.findFirstOrThrow({
//         where: { email: email },
//       });
 
//       // Verify user and password
//       if (!user || !(await bcrypt.compare(password, user.password))) {
//         return done(false, null);
//       }

//       //Return the user to passport
//       //First is an error, second is any user info
//       return done(null, user);
//     } catch (error) {
//       console.error(`error`, error);
//       return done(error, null);
//     }
//   }))
//   passport.serializeUser(function(user, cb) {
//     process.nextTick(function() {
//       return cb(null, {
//         id: user.id,
//         email: user.email
//       });
//     });
//   });
  
//   passport.deserializeUser(function(user, cb) {
//     process.nextTick(function() {
//       return cb(null, user);
//     });
//   });
// }
function checkIfAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      return res.redirect("/login");
    }
  }

module.exports = { checkIfAuthenticated,setUpPassportLocal}