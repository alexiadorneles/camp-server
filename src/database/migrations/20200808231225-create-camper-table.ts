import { DataTypes, QueryInterface, Sequelize } from 'sequelize'
import { CamperModel } from '../../models/CamperModel'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.createTable<CamperModel>('campers', {
			idCamper: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			idCabin: {
				type: DataTypes.INTEGER,
			},
			dsDescription: {
				type: DataTypes.STRING,
			},
			dsImageURL: {
				type: DataTypes.STRING,
			},
			dsInstagramNick: {
				type: DataTypes.STRING,
			},
			dsName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			dsPronouns: {
				type: DataTypes.STRING,
			},
			dtBirth: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			nrDiscordID: {
				type: DataTypes.INTEGER,
			},
			tpCountry: {
				type: DataTypes.STRING,
			},
			tpState: {
				type: DataTypes.STRING,
			},
		})
	},

	down: (queryInterface: QueryInterface, Sequelize: Sequelize) => {
		return queryInterface.dropTable('campers')
	},
}
