import SequelizeStatic, { QueryInterface } from 'sequelize'
import { CabinModel } from '../../models/CabinModel'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.createTable<CabinModel>('cabins', {
			idCabin: {
				primaryKey: true,
				allowNull: false,
				autoIncrement: true,
				type: SequelizeStatic.BIGINT,
			},
			dsImageURL: {
				allowNull: false,
				type: SequelizeStatic.STRING,
			},
			dsName: {
				allowNull: false,
				type: SequelizeStatic.STRING,
			},
			tpDivinityRelated: {
				allowNull: false,
				type: SequelizeStatic.STRING,
			},
		})
	},

	down: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.dropTable('cabin')
	},
}
