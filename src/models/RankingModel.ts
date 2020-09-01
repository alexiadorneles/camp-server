import { DataTypes, Model, Optional } from 'sequelize'
import database from '../database'
import { TimestampDependant } from '../types/Data'

export interface RankingAttributes extends TimestampDependant {
	idRanking: number
	idEdition: number
	idCabin: number
	nrPoints: number
	blFinal: boolean
}

export interface RankingCreationAttributes
	extends Optional<RankingAttributes, 'idRanking' | 'createdAt' | 'updatedAt'> {}

export class Ranking extends Model<RankingAttributes, RankingCreationAttributes> implements RankingAttributes {
	idRanking: number
	idEdition: number
	idCabin: number
	nrPoints: number
	blFinal: boolean
	// timestamps!
	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	public static tableName = 'rankings'

	public static associations: {}
	static associate: () => void
}

Ranking.init(
	{
		idRanking: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		idEdition: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		idCabin: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		nrPoints: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		blFinal: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
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
