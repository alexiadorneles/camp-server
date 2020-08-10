import { DataTypes, QueryInterface } from 'sequelize'
import { Edition } from '../../models'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.createTable<Edition>(Edition.tableName, {
			idEdition: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			dsName: {
				type: DataTypes.STRING,
			},
			nrParticipants: {
				type: DataTypes.INTEGER,
			},
			nrCabinLimit: {
				type: DataTypes.INTEGER,
			},
			dtBegin: {
				type: DataTypes.DATE,
			},
			dtEnd: {
				type: DataTypes.DATE,
				defaultValue: new Date(),
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
		return queryInterface.dropTable(Edition.tableName)
	},
}
