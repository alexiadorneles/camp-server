import { QueryInterface, DataTypes } from 'sequelize'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.createTable('cabinRequest', {
			idCabinRequest: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			idCamper: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			idEdition: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			idFirstOptionCabin: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			idSecondOptionCabin: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			idThirdOptionCabin: {
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
		return queryInterface.dropTable('cabinRequest')
	},
}
