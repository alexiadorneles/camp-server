import { QueryInterface } from 'sequelize'
import { CabinAttributes, Cabin } from '../../models'
import { Divinity } from '../../types/Mythology'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		const tyche: Partial<CabinAttributes> = {
			dsName: 'Chalé 19 - Tique',
			tpDivinityRelated: Divinity.TYCHE,
			dsImageURL: 'https://i.pinimg.com/originals/11/0b/cd/110bcd2fc100863dde1ff25154ea5872.jpg',
		}

		const hecate: Partial<CabinAttributes> = {
			dsName: 'Chalé 20 - Hécate',
			tpDivinityRelated: Divinity.HECATE,
			dsImageURL: 'https://acampamentomeiosangue-habbo.weebly.com/uploads/9/1/6/5/9165341/6667829.jpg?430',
		}

		return queryInterface.bulkInsert(Cabin.tableName, [tyche, hecate])
	},

	down: (queryInterface: QueryInterface, Sequelize: any) => {},
}
