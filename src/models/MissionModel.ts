import { DataTypes, Model, Optional } from 'sequelize'
import database from '../database'
import { TimestampDependant } from '../types/Data'

export interface MissionAttributes extends TimestampDependant {
	idMission: number
	idWinner: string
	dsQuestionTag: string
	tpActivity: string
	dsAnswer: string
}

export interface MissionCreationAttributes
	extends Optional<MissionAttributes, 'idMission' | 'createdAt' | 'updatedAt'> {}

export class Mission extends Model<MissionAttributes, MissionCreationAttributes> implements MissionAttributes {
	idMission!: number
	idWinner!: string
	dsQuestionTag!: string
	dsAnswer!: string
	tpActivity!: string

	// timestamps!
	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	public static tableName = 'Mission'

	public static associations: {}
	static associate: () => void
}

Mission.init(
	{
		idMission: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		idWinner: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		dsAnswer: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		dsQuestionTag: {
			type: DataTypes.STRING,
		},
		tpActivity: {
			type: DataTypes.STRING,
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
