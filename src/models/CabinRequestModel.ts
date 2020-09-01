import { DataTypes, Model, Optional } from 'sequelize'
import database from '../database'
import { TimestampDependant } from '../types/Data'
import { Cabin } from './CabinModel'

export enum Status {
	RESOLVED = 'resolved',
	UNRESOLVED = 'unresolved',
}

export interface CabinRequestAttributes extends TimestampDependant {
	idCabinRequest: number
	idCamper: number
	idEdition: number
	idFirstOptionCabin: number
	idSecondOptionCabin: number
	idThirdOptionCabin: number
	status: Status
	firstOptionCabin?: Cabin
	secondOptionCabin?: Cabin
	thirdOptionCabin?: Cabin
	isFirstEdition?: boolean
}

export interface CabinRequestCreationAttributes
	extends Optional<CabinRequestAttributes, 'idCabinRequest' | 'createdAt' | 'updatedAt'> {}

export class CabinRequest extends Model<CabinRequestAttributes, CabinRequestCreationAttributes>
	implements CabinRequestAttributes {
	idCabinRequest: number
	idCamper: number
	idEdition: number
	idFirstOptionCabin: number
	idSecondOptionCabin: number
	idThirdOptionCabin: number
	status: Status
	firstOptionCabin?: Cabin
	secondOptionCabin?: Cabin
	thirdOptionCabin?: Cabin
	isFirstEdition?: boolean

	// timestamps!
	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	public static tableName = 'CabinRequest'

	public static associations: {}
	static associate: () => void
}

CabinRequest.init(
	{
		idCabinRequest: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		idCamper: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		idEdition: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		idFirstOptionCabin: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		idSecondOptionCabin: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		idThirdOptionCabin: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: Status.UNRESOLVED,
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
