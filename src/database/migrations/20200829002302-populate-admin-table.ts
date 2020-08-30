import bcrypt from 'bcryptjs'
import { QueryInterface } from 'sequelize'
import { Admin, AdminCreationAttributes } from '../../models/AdminModel'

import dotenv from 'dotenv'
dotenv.config()

const { ADMIN_EMAIL, ADMIN_GOOGLE_ID, ADMIN_PASSWORD } = process.env

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		const admin: AdminCreationAttributes = {
			dsEmail: ADMIN_EMAIL,
			idGoogle: ADMIN_GOOGLE_ID,
			dsName: 'Portal Percy Jackson',
			password: bcrypt.hashSync(ADMIN_PASSWORD, 8),
		}
		const model = new Admin(admin)
		return queryInterface.insert(model, Admin.tableName, admin)
	},

	down: (queryInterface: QueryInterface, Sequelize: any) => {},
}
