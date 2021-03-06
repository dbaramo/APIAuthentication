const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const GooglePlusTokenStrategy = require("passport-google-plus-token");
const { JWT_SECRET, clientID, clientSecret } = require("./configuration");
const User = require("./models/user");

// JSON WEB TOKEN STRATEGY
passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromHeader("authorization"),
			secretOrKey: JWT_SECRET
		},
		async (payload, done) => {
			try {
				// Find the user specified in token
				const user = await User.findById(payload.sub);

				// If user dosen't exists, handle it
				if (!user) {
					return done(null, false);
				}

				// Otherwise, return the user
				done(null, user);
			} catch (error) {
				done(error, false);
			}
		}
	)
);

// GOOGLE OAUTH STRATEGY
passport.use(
	"googleToken",
	new GooglePlusTokenStrategy(
		{
			clientID,
			clientSecret
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				// Check whether this current user exists in our DB
				const existingUser = await User.findOne({
					"google.id": profile.id
				});
				if (existingUser) {
					return done(null, existingUser);
				}

				// If new account
				const newUser = new User({
					method: "google",
					google: {
						id: profile.id,
						email: profile.emails[0].value
					}
				});

				await newUser.save();
				done(null, newUser);
			} catch (error) {
				done(error, false, error.message);
			}
		}
	)
);

// LOCAL STRATEGY
passport.use(
	new LocalStrategy(
		{
			usernameField: "email"
		},
		async (email, password, done) => {
			try {
				// Find the user given the email
				const user = await User.findOne({ "local.email": email });

				// If not, handle it
				if (!user) {
					return done(null, false);
				}

				// Check if the password is correct
				const isMatch = await user.isValidPassword(password);

				console.log(isMatch);

				// If not, handle it
				if (!isMatch) {
					return done(null, false);
				}

				// Otherwise, return the user
				done(null, user);
			} catch (error) {
				done(error, false);
			}
		}
	)
);
