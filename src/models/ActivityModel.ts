import {
	Association,
	DataTypes,
	HasManyGetAssociationsMixin,
	HasManySetAssociationsMixin,
	Model,
	Optional,
	HasManyAddAssociationMixin,
	HasManyCreateAssociationMixin,
} from 'sequelize'
import database from '../database'
import { TimestampDependant } from '../types/Data'
import { ActivityType, Level } from '../types/Level'
import { ActivityOption, ActivityOptionCreationAttribute } from './ActivityOptionModel'

export interface ActivityAttributes extends TimestampDependant {
	idActivity: number
	dsQuestion: string
	tpLevel: Level
	tpActivity: ActivityType
	options?: ActivityOption[]
}

export interface ActivityCreationAttribute
	extends Optional<ActivityAttributes, 'idActivity' | 'createdAt' | 'updatedAt'> {}

export class Activity extends Model<ActivityAttributes, ActivityCreationAttribute> implements ActivityAttributes {
	idQuestion: number
	idActivity: number
	dsQuestion: string
	tpLevel: Level
	tpActivity: ActivityType
	// timestamps!
	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	public static tableName = 'activities'

	public static associations: {
		options: Association<Activity, ActivityOption>
	}
	static associate: () => void

	public getOptions!: HasManyGetAssociationsMixin<ActivityOption>
	public setOptions!: HasManySetAssociationsMixin<ActivityOption, number>
	public addOption!: HasManyAddAssociationMixin<ActivityOption, number>
	public createOption!: HasManyCreateAssociationMixin<ActivityOptionCreationAttribute>
}

Activity.init(
	{
		idActivity: {
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
			type: DataTypes.BIGINT,
		},
		dsQuestion: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		tpActivity: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		tpLevel: {
			type: DataTypes.STRING,
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
