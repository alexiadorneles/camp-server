import { DataTypes, QueryInterface } from 'sequelize'
import { ActivityEdition } from '../../models'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.createTable<ActivityEdition>(ActivityEdition.tableName, {
			idActivityEdition: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			idEdition: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			tpActivity: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			nrPoints: {
				type: DataTypes.INTEGER,
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
		return queryInterface.dropTable(ActivityEdition.tableName)
	},
}
