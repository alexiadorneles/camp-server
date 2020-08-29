import { QueryInterface, DataTypes } from 'sequelize'
import { Admin } from '../../models/AdminModel'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.createTable<Admin>(Admin.tableName, {
			idAdmin: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			idGoogle: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			dsEmail: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			dsName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			createdAt: {
				type: DataTypes.DATE,
				defaultValue: new Date(),
			},
			updatedAt: {
				type: DataTypes.DATE,
				defaultValue: new Date(),
			},
		})
	},

	down: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.dropTable(Admin.tableName)
	},
}
