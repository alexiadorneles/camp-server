import {
	Association,
	DataTypes,
	HasOneCreateAssociationMixin,
	HasOneGetAssociationMixin,
	Model,
	Optional,
} from 'sequelize'
import database from '../database'
import { CabinModel } from './CabinModel'

interface CamperAttributes {
	idCamper: string
	idCabin: string
	dsName: string
	nrDiscordID: number
	dsInstagramNick: string
	dtBirth: Date
	tpState: string
	tpCountry: string
	dsPronouns: string
	dsDescription: string
	dsImageURL: string
}

interface CamperCreationAttributes extends Optional<CamperAttributes, 'idCamper'> {}

export class CamperModel extends Model<CamperAttributes, CamperCreationAttributes> implements CamperAttributes {
	public idCamper!: string
	public idCabin!: string
	public dsName!: string
	public nrDiscordID!: number
	public dsInstagramNick!: string
	public dtBirth!: Date
	public tpState!: string
	public tpCountry!: string
	public dsPronouns!: string
	public dsDescription!: string
	public dsImageURL!: string

	// timestamps!
	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	public getCabin!: HasOneGetAssociationMixin<CabinModel> // Note the null assertions!
	public createCabin!: HasOneCreateAssociationMixin<CabinModel>

	public static associations: {
		cabin: Association<CamperModel, CabinModel>
	}

	public static associate(): void {
		this.hasOne(CabinModel, { foreignKey: 'idCabin', as: 'cabin' })
	}
}

CamperModel.init(
	{
		idCamper: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		idCabin: {
			type: DataTypes.INTEGER,
		},
		dsDescription: {
			type: DataTypes.STRING,
		},
		dsImageURL: {
			type: DataTypes.STRING,
		},
		dsInstagramNick: {
			type: DataTypes.STRING,
		},
		dsName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		dsPronouns: {
			type: DataTypes.STRING,
		},
		dtBirth: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		nrDiscordID: {
			type: DataTypes.INTEGER,
		},
		tpCountry: {
			type: DataTypes.STRING,
		},
		tpState: {
			type: DataTypes.STRING,
		},
	},
	{
		sequelize: database.connection,
	},
)

CamperModel.associate()
