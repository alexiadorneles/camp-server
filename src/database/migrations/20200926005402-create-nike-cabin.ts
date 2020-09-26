import { QueryInterface } from 'sequelize'
import { CabinAttributes, Cabin } from '../../models'
import { Divinity } from '../../types/Mythology'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		const nike: Partial<CabinAttributes> = {
			dsName: 'Chalé 17 - Nike',
			tpDivinityRelated: Divinity.NIKE,
			dsImageURL: 'https://pm1.narvii.com/6298/5eec14f0eab56665889bb5517468de2ae181641a_00.jpg',
		}

		return queryInterface.bulkInsert(Cabin.tableName, [nike])
	},

	down: (queryInterface: QueryInterface, Sequelize: any) => {},
}
