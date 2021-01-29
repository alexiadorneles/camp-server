import dotenv from 'dotenv'
dotenv.config()

const { DATABASE_URL, DATABASE_NAME, DATABASE_USER_NAME, DATABASE_PASSWORD } = process.env

export default {
	dialect: 'mysql',
	host: DATABASE_URL,
	username: DATABASE_USER_NAME,
	password: DATABASE_PASSWORD,
	database: DATABASE_NAME,
	define: {
		timestamps: true,
	},
	dialectOptions: {
		dateStrings: true,
		typeCast: true,
	},
	timezone: '-03:00',
}
