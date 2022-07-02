const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const UserModel = require('../models/user.model')

const jwtOptions = {
	secretOrKey: config.jwt.secret,
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
};

const jwtVerify = async (payload, done) => {
	console.log("payload  :", payload)

	try {
		console.log('payload.sub.user :', payload.sub.user)
		const user = await UserModel.findById(payload.sub.user);
		console.log('user :', user)
		if (!user) {
			return done(null, false);
		}
		done(null, user);
	} catch (error) {
		done(error, false);
	}
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
	jwtStrategy,
};
