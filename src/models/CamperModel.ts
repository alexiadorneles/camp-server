import {
	Association,
	DataTypes,
	HasManyCreateAssociationMixin,
	HasOneCreateAssociationMixin,
	HasOneGetAssociationMixin,
	Model,
	Optional,
} from 'sequelize'
import database from '../database'
import { TimestampDependant } from '../types/Data'
import { Activity } from './ActivityModel'
import { Cabin, CabinAttributes } from './CabinModel'
import { CamperActivity } from './CamperActivityModel'

export interface CamperAttributes extends TimestampDependant {
	idCamper: number
	idCabin: number
	dsName: string
	idGoogle: string
	nrDiscordID: number
	dsInstagramNick: string
	dtBirth: Date
	tpState: string
	tpCountry: string
	dsPronouns: string
	dsDescription: string
	dsImageURL: string
	dsEmail: string
	blRegisterCompleted: boolean
	cabin?: CabinAttributes
}

export interface CamperCreationAttributes extends Optional<CamperAttributes, 'idCamper' | 'createdAt' | 'updatedAt'> {}

export class Camper extends Model<CamperAttributes, CamperCreationAttributes> implements CamperAttributes {
	public idCamper!: number
	public idCabin!: number
	public dsName!: string
	public nrDiscordID!: number
	public dsInstagramNick!: string
	public dtBirth!: Date
	public tpState!: string
	public tpCountry!: string
	public dsPronouns!: string
	public dsDescription!: string
	public dsImageURL!: string
	public idGoogle: string
	public dsEmail: string
	blRegisterCompleted: boolean

	// timestamps!
	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	public getCabin!: HasOneGetAssociationMixin<Cabin> // Note the null assertions!
	public createCabin!: HasOneCreateAssociationMixin<Cabin>
	public createCamperActivity!: HasManyCreateAssociationMixin<CamperActivity>

	public static tableName = 'campers'

	public static associations: {
		cabin: Association<Camper, Cabin>
		activities: Association<Camper, Activity>
	}
	static associate: () => void
}

Camper.init(
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
		idGoogle: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		dsEmail: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		dsDescription: {
			type: DataTypes.STRING,
		},
		dsImageURL: {
			type: DataTypes.BLOB,
			get() {
				return this.getDataValue('dsImageURL') && (this.getDataValue('dsImageURL') as any).toString('utf8')
			},
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
		blRegisterCompleted: {
			type: DataTypes.BOOLEAN,
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
