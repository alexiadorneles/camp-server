import { DataTypes, QueryInterface } from 'sequelize'
import { Ranking } from '../../models/RankingModel'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.createTable<Ranking>(Ranking.tableName, {
			idRanking: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			idEdition: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			idCabin: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			nrPoints: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			blFinal: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			createdAt: {
				type: DataTypes.DATE,
				defaultValue: new Date(),
			},
			updatedAt: {
				type: DataTypes.DATE,
				defaultValue: new Date(),
			},
		})
	},

	down: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.dropTable(Ranking.tableName)
	},
}
