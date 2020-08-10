import { DataTypes, QueryInterface, Sequelize } from 'sequelize'
import { Camper } from '../../models'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.createTable<Camper>(Camper.tableName, {
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
				type: DataTypes.BLOB,
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

	down: (queryInterface: QueryInterface, Sequelize: Sequelize) => {
		return queryInterface.dropTable('campers')
	},
}
