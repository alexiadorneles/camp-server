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
			dsAnswer: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			dsQuestionTag: {
				type: DataTypes.STRING,
			},
			tpActivity: {
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
