import { QueryInterface } from 'sequelize'
import { CabinAttributes, Cabin } from '../../models'
import { Divinity } from '../../types/Mythology'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		const iris: Partial<CabinAttributes> = {
			dsName: 'Chalé 14 - Íris',
			tpDivinityRelated: Divinity.IRIS,
			dsImageURL: 'https://i.pinimg.com/originals/b3/c1/88/b3c1888a4736a2e45a639d80e9a951fc.jpg',
		}

		const hypnos: Partial<CabinAttributes> = {
			dsName: 'Chalé 15 - Hipnos',
			tpDivinityRelated: Divinity.HYPNOS,
			dsImageURL: 'https://i.pinimg.com/originals/4e/f2/be/4ef2bef5ba6c03a1d802fe05eeb9b807.jpg',
		}

		const nemesis: Partial<CabinAttributes> = {
			dsName: 'Chalé 16 - Nêmesis',
			tpDivinityRelated: Divinity.NEMESIS,
			dsImageURL: 'https://i.pinimg.com/originals/59/a2/b6/59a2b63507e3e4f46ff8c573bfc4c18c.jpg',
		}

		const nike: Partial<CabinAttributes> = {
			dsName: 'Chalé 17 - Nike',
			tpDivinityRelated: Divinity.NIKE,
			dsImageURL: 'https://pm1.narvii.com/6298/5eec14f0eab56665889bb5517468de2ae181641a_00.jpg',
		}

		const hebe: Partial<CabinAttributes> = {
			dsName: 'Chalé 18 - Hebe',
			tpDivinityRelated: Divinity.HEBE,
			dsImageURL: 'https://pm1.narvii.com/6770/91826a2b37d3d0ae8bfbc97f108bdc93d00eda65v2_00.jpg',
		}

		return queryInterface.bulkInsert(Cabin.tableName, [iris, hypnos, nemesis, hebe])
	},

	down: (queryInterface: QueryInterface, Sequelize: any) => {},
}
