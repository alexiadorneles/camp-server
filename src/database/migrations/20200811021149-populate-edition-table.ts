import { QueryInterface } from 'sequelize'
import { Edition, EditionCreationAttributes, EditionAttributes } from '../../models'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		const edition: Partial<EditionAttributes> = {
			dsName: '1a Edição',
			nrCabinLimit: 25,
			dtBegin: new Date(2020, 5, 10),
			dtEnd: new Date(2020, 6, 4),
			nrParticipants: 300,
		}
		return queryInterface.bulkInsert(Edition.tableName, [edition])
	},

	down: (queryInterface: QueryInterface, Sequelize: any) => {},
}
