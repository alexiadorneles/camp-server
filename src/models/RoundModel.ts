import { DataTypes, Model, Optional } from 'sequelize'
import database from '../database'
import { TimestampDependant } from '../types/Data'

export interface RoundAttributes extends TimestampDependant {
	idRound: number
	idEdition: number
	dtBegin: Date
	dtEnd: Date | null
	blFinished: boolean
}

export interface RoundCreationAttributes extends Optional<RoundAttributes, 'idRound' | 'createdAt' | 'updatedAt'> {}

export class Round extends Model<RoundAttributes, RoundCreationAttributes> implements RoundAttributes {
	idRound: number
	idEdition: number
	dtBegin: Date
	dtEnd: Date
	blFinished: boolean

	// timestamps!
	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	public static tableName = 'rounds'

	public static associations: {}
	static associate: () => void
}

Round.init(
	{
		idRound: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		idEdition: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		blFinished: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: true,
		},
		dtBegin: {
			type: DataTypes.DATE,
		},
		dtEnd: {
			type: DataTypes.DATE,
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
