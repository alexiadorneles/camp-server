import { QueryInterface, DataTypes } from 'sequelize'
import { CamperActivity } from '../../models'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.createTable<CamperActivity>(CamperActivity.tableName, {
			idCamperActivity: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			idCamper: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			idActivity: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			idActivityOption: {
				type: DataTypes.INTEGER,
			},
			idEdition: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			blCorrect: {
				type: DataTypes.BOOLEAN,
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
		return queryInterface.dropTable(CamperActivity.tableName)
	},
}
