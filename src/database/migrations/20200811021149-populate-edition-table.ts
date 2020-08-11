import { QueryInterface } from 'sequelize'
import { Edition, EditionCreationAttributes } from '../../models'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		const edition: Partial<EditionCreationAttributes> = {
			dsName: '2a Edição',
			dtBegin: new Date(),
			nrCabinLimit: 25,
		}
		return queryInterface.bulkInsert(Edition.tableName, [edition])
	},

	down: (queryInterface: QueryInterface, Sequelize: any) => {},
}
