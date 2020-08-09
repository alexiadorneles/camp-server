import SequelizeStatic, { Association, Model, Optional } from 'sequelize'
import database from '../database'
import { CamperModel } from './CamperModel'

interface CabinAttributes {
	idCabin: string
	dsName: string
	tpDivinityRelated: string
	dsImageURL: string
}

interface CabinCreationAttributes extends Optional<CabinAttributes, 'idCabin'> {}

export class CabinModel extends Model<CabinAttributes, CabinCreationAttributes> implements CabinAttributes {
	public idCabin!: string
	public dsName!: string
	public tpDivinityRelated: string
	public dsImageURL!: string

	// timestamps!
	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	public static associations: {
		campers: Association<CabinModel, CamperModel>
	}

	public static associate(): void {
		this.belongsToMany(CamperModel, { foreignKey: 'idCabin', through: 'cabin' })
	}
}

CabinModel.init(
	{
		idCabin: {
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
			type: SequelizeStatic.BIGINT,
		},
		dsImageURL: {
			allowNull: false,
			type: SequelizeStatic.INTEGER,
		},
		dsName: {
			allowNull: false,
			type: SequelizeStatic.STRING,
		},
		tpDivinityRelated: {
			allowNull: false,
			type: SequelizeStatic.STRING,
		},
	},
	{
		sequelize: database.connection,
	},
)

CabinModel.associate()
