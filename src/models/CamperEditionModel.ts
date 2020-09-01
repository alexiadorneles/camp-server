import {
	Association,
	DataTypes,
	HasOneGetAssociationMixin,
	HasOneSetAssociationMixin,
	Model,
	Optional,
} from 'sequelize'
import database from '../database'
import { TimestampDependant } from '../types/Data'
import { Cabin, CabinAttributes } from './CabinModel'

export interface CamperEditionAttributes extends TimestampDependant {
	idCamperEdition: number
	idCamper: number
	idEdition: number
	idCabin: number
	cabin?: CabinAttributes
}

export interface CamperEditionCreationAttributes
	extends Optional<CamperEditionAttributes, 'idCamper' | 'createdAt' | 'updatedAt'> {}

export class CamperEdition extends Model<CamperEditionAttributes, CamperEditionCreationAttributes>
	implements CamperEditionAttributes {
	idCamperEdition: number
	idCamper: number
	idEdition: number
	idCabin: number
	cabin?: CabinAttributes

	// timestamps!
	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	public getCabin!: HasOneGetAssociationMixin<Cabin>
	public setCabin!: HasOneSetAssociationMixin<Cabin, number>

	public static tableName = 'CamperEditions'

	public static associations: {
		cabin: Association<CamperEdition, Cabin>
	}
	static associate: () => void
}

CamperEdition.init(
	{
		idCamperEdition: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		idCabin: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		idEdition: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		idCamper: {
			type: DataTypes.INTEGER,
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
