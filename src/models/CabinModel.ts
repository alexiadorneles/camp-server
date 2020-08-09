import SequelizeStatic, { Association, Model, Optional } from 'sequelize'
import database from '../database'
import { Camper } from './CamperModel'
import { TimestampDependant } from '../types/Data'

export interface CabinAttributes extends TimestampDependant {
	idCabin: number
	dsName: string
	tpDivinityRelated: string
	dsImageURL: string
}

export interface CabinCreationAttributes extends Optional<CabinAttributes, 'idCabin'> {}

export class Cabin extends Model<CabinAttributes, CabinCreationAttributes> implements CabinAttributes {
	public idCabin!: number
	public dsName!: string
	public tpDivinityRelated: string
	public dsImageURL!: string

	// timestamps!
	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	public static tableName = 'cabins'

	public static associations: {
		campers: Association<Cabin, Camper>
	}

	public static associate(): void {
		this.belongsToMany(Camper, { foreignKey: 'idCabin', through: 'cabin' })
	}
}

Cabin.init(
	{
		idCabin: {
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
			type: SequelizeStatic.BIGINT,
		},
		dsImageURL: {
			allowNull: false,
			type: SequelizeStatic.STRING,
		},
		dsName: {
			allowNull: false,
			type: SequelizeStatic.STRING,
		},
		tpDivinityRelated: {
			allowNull: false,
			type: SequelizeStatic.STRING,
		},
		createdAt: {
			type: SequelizeStatic.DATE,
			defaultValue: new Date(),
		},
		updatedAt: {
			type: SequelizeStatic.DATE,
			defaultValue: new Date(),
		},
	},
	{
		sequelize: database.connection,
	},
)

Cabin.associate()
