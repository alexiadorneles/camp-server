import { DataTypes, Model, Optional } from 'sequelize'
import database from '../database'
import { TimestampDependant } from '../types/Data'

export interface CamperActivityAttributes extends TimestampDependant {
	idCamperActivity: number
	idCamper: number
	idActivity: number
	idActivityOption: number
	idEdition: number
	blCorrect: boolean
}

export interface CamperActivityCreationAttributes
	extends Optional<CamperActivityAttributes, 'idCamperActivity' | 'createdAt' | 'updatedAt'> {}

export class CamperActivity extends Model<CamperActivityAttributes, CamperActivityCreationAttributes>
	implements CamperActivityAttributes {
	idEdition: number
	idCamperActivity: number
	idCamper: number
	idActivity: number
	idActivityOption: number
	blCorrect: boolean
	// timestamps!
	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	public static tableName = 'CamperActivities'

	public static associations: {}
	static associate: () => void
}

CamperActivity.init(
	{
		idCamperActivity: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		idCamper: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		idActivity: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		idActivityOption: {
			type: DataTypes.INTEGER,
		},
		idEdition: {
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
	},
	{
		sequelize: database.connection,
	},
)
