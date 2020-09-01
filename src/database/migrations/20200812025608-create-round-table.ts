import { QueryInterface, DataTypes } from 'sequelize'
import { Round } from '../../models/RoundModel'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.createTable<Round>(Round.tableName, {
			idRound: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			idCamper: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			idEdition: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			blFinished: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: true,
			},
			dtBegin: {
				type: DataTypes.DATE,
			},
			dtEnd: {
				type: DataTypes.DATE,
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
		return queryInterface.dropTable(Round.tableName)
	},
}
