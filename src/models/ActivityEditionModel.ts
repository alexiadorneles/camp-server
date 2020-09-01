import { DataTypes, Model, Optional } from 'sequelize'
import database from '../database'
import { TimestampDependant } from '../types/Data'
import { ActivityType } from '../types/Activity'

export interface ActivityEditionAttributes extends TimestampDependant {
	idActivityEdition: number
	tpActivity: ActivityType
	idEdition: number
	nrPoints: number
}

export interface ActivityEditionCreationAttributes
	extends Optional<ActivityEditionAttributes, 'idActivityEdition' | 'createdAt' | 'updatedAt'> {}

export class ActivityEdition extends Model<ActivityEditionAttributes, ActivityEditionCreationAttributes>
	implements ActivityEditionAttributes {
	idActivityEdition: number
	idEdition: number
	tpActivity: ActivityType
	nrPoints: number

	// timestamps!
	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	public static tableName = 'ActivityEditions'
	static associate: () => void
}

ActivityEdition.init(
	{
		idActivityEdition: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		idEdition: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		tpActivity: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		nrPoints: {
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
	},
	{
		sequelize: database.connection,
	},
)
