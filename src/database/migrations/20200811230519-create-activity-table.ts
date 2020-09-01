import { QueryInterface, DataTypes } from 'sequelize'
import { Activity } from '../../models/ActivityModel'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.createTable(Activity.tableName, {
			idActivity: {
				primaryKey: true,
				allowNull: false,
				autoIncrement: true,
				type: DataTypes.BIGINT,
			},
			dsQuestion: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			tpActivity: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			tpLevel: {
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
		return queryInterface.dropTable(Activity.tableName)
	},
}
