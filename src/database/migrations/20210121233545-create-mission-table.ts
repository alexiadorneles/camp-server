import { DataTypes, QueryInterface } from 'sequelize'
import { Mission } from '../../models/MissionModel'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.createTable<Mission>(Mission.tableName, {
			idMission: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			idWinner: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			answer: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			questionTag: {
				type: DataTypes.STRING,
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

	down: (queryInterface: QueryInterface, Sequelize: any) => {},
}
