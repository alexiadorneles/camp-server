import { QueryInterface, DataTypes } from 'sequelize'
import { Camper } from '../../models'

export = {
	up: async (queryInterface: QueryInterface, Sequelize: any) => {
		await queryInterface.renameColumn(Camper.tableName, 'nrDiscordID', 'dsDiscordID')
		return queryInterface.changeColumn(Camper.tableName, 'dsDiscordID', DataTypes.STRING)
	},

	down: (queryInterface: QueryInterface, Sequelize: any) => {},
}
