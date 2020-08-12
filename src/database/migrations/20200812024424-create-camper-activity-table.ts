import { QueryInterface, DataTypes } from 'sequelize'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		return queryInterface.createTable('CamperActivities', {
			idCamperActivity: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			idCamper: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			idActivity: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			blCorrect: {
				type: DataTypes.BOOLEAN,
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
		return queryInterface.dropTable('CamperActivities')
	},
}
