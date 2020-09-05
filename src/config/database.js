const dotenv = require('dotenv')
dotenv.config()
const { DATABASE_URL, DATABASE_NAME, DATABASE_USER_NAME, DATABASE_PASSWORD } = process.env

module.exports = {
	dialect: 'mysql',
	host: DATABASE_URL,
	username: DATABASE_USER_NAME,
	password: DATABASE_PASSWORD,
	database: DATABASE_NAME,
	define: {
		timestamps: true,
	},
	dialectOptions: {
		useUTC: false,
	},
	timezone: '-03:00',
}
