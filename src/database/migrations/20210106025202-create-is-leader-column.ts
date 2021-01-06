import { QueryInterface } from 'sequelize'
import { CamperEdition } from '../../models/CamperEditionModel'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.addColumn(CamperEdition.tableName, 'isLeader', {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
		})
	},

	down: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.dropTable(CamperEdition.tableName)
	},
}
