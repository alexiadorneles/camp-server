import SequelizeStatic, { QueryInterface } from 'sequelize'
import { Cabin } from '../../models'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.createTable<Cabin>(Cabin.tableName, {
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
			createdAt: {
				type: SequelizeStatic.DATE,
				defaultValue: new Date(),
			},
			updatedAt: {
				type: SequelizeStatic.DATE,
				defaultValue: new Date(),
			},
		})
	},

	down: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.dropTable('cabin')
	},
}
