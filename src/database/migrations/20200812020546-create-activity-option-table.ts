import { QueryInterface, DataTypes } from 'sequelize'
import { ActivityOption } from '../../models/ActivityOptionModel'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.createTable(ActivityOption.tableName, {
			idActivityOption: {
				primaryKey: true,
				allowNull: false,
				autoIncrement: true,
				type: DataTypes.BIGINT,
			},
			idActivity: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			blCorrect: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			dsOption: {
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
		return queryInterface.dropTable(ActivityOption.tableName)
	},
}
