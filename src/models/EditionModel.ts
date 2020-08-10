import { DataTypes, Model, Optional } from 'sequelize'
import database from '../database'
import { TimestampDependant } from '../types/Data'

export interface EditionAttributes extends TimestampDependant {
	idEdition: string
	dtBegin: Date | null
	dtEnd: Date | null
	dsName: string
	nrParticipants: number
	nrCabinLimit: number

	// TODO: save winner, find a way to create a history
	// about which cabin a camper was, it's data from the game
}

export interface EditionCreationAttributes
	extends Optional<EditionAttributes, 'idEdition' | 'createdAt' | 'updatedAt'> {}

export class Edition extends Model<EditionAttributes, EditionCreationAttributes> implements EditionAttributes {
	idEdition: string
	dtBegin: Date
	dtEnd: Date
	dsName: string
	nrParticipants: number
	nrCabinLimit: number

	// timestamps!
	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	public static tableName = 'edition'

	public static associations: {}
	static associate: () => void
}

Edition.init(
	{
		idEdition: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		dsName: {
			type: DataTypes.STRING,
		},
		nrParticipants: {
			type: DataTypes.INTEGER,
		},
		nrCabinLimit: {
			type: DataTypes.INTEGER,
		},
		dtBegin: {
			type: DataTypes.DATE,
		},
		dtEnd: {
			type: DataTypes.DATE,
			defaultValue: new Date(),
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
