import { QueryInterface } from 'sequelize'
import { CabinCreationAttributes } from '../../models'
import { Divinity } from '../../types/Mythology'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		const cabins: Partial<CabinCreationAttributes>[] = [
			{
				dsName: 'Chalé 1 - Zeus',
				idCabin: 1,
				tpDivinityRelated: Divinity.ZEUS,
				dsImageURL:
					'https://cdna.artstation.com/p/assets/images/images/011/621/560/medium/elinor-riley-cabin-1-concept-2.jpg?1530538576',
			},
			{
				dsName: 'Chalé 2 - Hera',
				idCabin: 2,
				tpDivinityRelated: Divinity.HERA,
				dsImageURL:
					'https://cdna.artstation.com/p/assets/images/images/011/621/570/large/elinor-riley-cabin-2-concept-finished.jpg?1530538598',
			},

			{
				dsName: 'Chalé 3 - Poseidon',
				idCabin: 3,
				tpDivinityRelated: Divinity.POSEIDON,
				dsImageURL:
					'https://cdna.artstation.com/p/assets/images/images/011/621/578/small/elinor-riley-cabin-3-concept-complete.jpg?1530538627',
			},
			{
				dsName: 'Calé 4 - Deméter',
				idCabin: 4,
				tpDivinityRelated: Divinity.DEMETER,
				dsImageURL:
					'https://cdnb.artstation.com/p/assets/images/images/011/621/585/small/elinor-riley-cabin-4-concept-croped.jpg?1530538665',
			},
			{
				dsName: 'Chalé 5 - Ares',
				idCabin: 5,
				tpDivinityRelated: Divinity.ARES,
				dsImageURL:
					'https://cdnb.artstation.com/p/assets/images/images/011/621/589/small/elinor-riley-cabin-5-concept.jpg?1530538681',
			},
			{
				dsName: 'Chalé 6 - Atena',
				idCabin: 6,
				tpDivinityRelated: Divinity.ATHENA,
				dsImageURL:
					'https://cdnb.artstation.com/p/assets/images/images/011/621/599/small/elinor-riley-cabin-6-concept.jpg?1530538696',
			},
			{
				dsName: 'Chalé 7 - Apolo',
				idCabin: 7,
				tpDivinityRelated: Divinity.APOLLO,
				dsImageURL:
					'https://cdna.artstation.com/p/assets/images/images/012/833/146/small/elinor-riley-cabin-7-cocnept.jpg?1536747378',
			},
			{
				dsName: 'Chalé 8 - Ártemis',
				idCabin: 8,
				tpDivinityRelated: Divinity.ARTEMIS,
				dsImageURL:
					'https://cdna.artstation.com/p/assets/images/images/012/833/148/small/elinor-riley-cabin-8-concept.jpg?1536746958',
			},
			{
				dsName: 'Chalé 9 - Hefesto',
				idCabin: 9,
				tpDivinityRelated: Divinity.HEPHAESTUS,
				dsImageURL:
					'https://cdnb.artstation.com/p/assets/images/images/012/833/149/small/elinor-riley-cabin-9-concept.jpg?1536746961',
			},
			{
				dsName: 'Chalé 10 - Afrodite',
				idCabin: 10,
				tpDivinityRelated: Divinity.APHRODITE,
				dsImageURL:
					'https://cdna.artstation.com/p/assets/images/images/012/833/152/small/elinor-riley-cabin-10-concpet.jpg?1536746965',
			},
			{
				dsName: 'Chalé 11 - Hermes',
				idCabin: 11,
				tpDivinityRelated: Divinity.HERMES,
				dsImageURL:
					'https://cdnb.artstation.com/p/assets/images/images/012/833/153/small/elinor-riley-cabin-11-concept.jpg?1536746971',
			},
			{
				dsName: 'Chalé 12 - Dionísio',
				idCabin: 12,
				tpDivinityRelated: Divinity.DIONYSUS,
				dsImageURL:
					'https://cdnb.artstation.com/p/assets/images/images/012/833/145/small/elinor-riley-cabin-12-concept.jpg?1536746941',
			},
		]
		return queryInterface.bulkInsert('cabins', cabins)
	},

	down: (queryInterface: QueryInterface, Sequelize: any) => {},
}
