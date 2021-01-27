import { DataTypes, QueryInterface } from 'sequelize'
import { PaidInscription } from '../../models/PaidInscription'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.createTable<PaidInscription>(PaidInscription.tableName, {
			idPaidInscription: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			idCabin: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			idEdition: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			dsEmail: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			blActivated: {
				type: DataTypes.BOOLEAN,
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
		return queryInterface.dropTable(PaidInscription.tableName)
	},
}
