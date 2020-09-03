import { QueryInterface } from 'sequelize'
import { CabinAttributes, Cabin } from '../../models'
import { Divinity } from '../../types/Mythology'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		const hadesCabin: Partial<CabinAttributes> = {
			dsName: 'Chalé 13 - Hades',
			tpDivinityRelated: Divinity.HADES,
			dsImageURL:
				'https://vignette.wikia.nocookie.net/camp-halfblood-roleplay/images/c/c0/Hades%27_Cabin.png/revision/latest/scale-to-width-down/340?cb=20121222145600',
		}
		return queryInterface.bulkInsert(Cabin.tableName, [hadesCabin])
	},

	down: (queryInterface: QueryInterface, Sequelize: any) => {},
}
