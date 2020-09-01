import { DataTypes, QueryInterface } from 'sequelize'
import { CamperEdition } from '../../models/CamperEditionModel'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.createTable<CamperEdition>(CamperEdition.tableName, {
			idCamperEdition: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			idCabin: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			idEdition: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			idCamper: {
				type: DataTypes.INTEGER,
				allowNull: false,
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
		return queryInterface.dropTable(CamperEdition.tableName)
	},
}
