import { DataTypes, Model, Optional } from 'sequelize'
import database from '../database'
import { TimestampDependant } from '../types/Data'

export interface PaidInscriptionAttributes extends TimestampDependant {
	idPaidInscription: number
	idCabin: number
	idEdition: string
	dsEmail: string
	dsCode: string
	blActivated: boolean
}

export interface PaidInscriptionCreationAttributes
	extends Optional<PaidInscriptionAttributes, 'idPaidInscription' | 'createdAt' | 'updatedAt'> {}

export class PaidInscription extends Model<PaidInscriptionAttributes, PaidInscriptionCreationAttributes>
	implements PaidInscriptionAttributes {
	idPaidInscription: number
	idCabin: number
	idEdition: string
	dsEmail: string
	dsCode: string
	blActivated: boolean

	// timestamps!
	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	public static tableName = 'PaidInscription'

	public static associations: {}
	static associate: () => void
}

PaidInscription.init(
	{
		idPaidInscription: {
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
		dsEmail: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		dsCode: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		blActivated: {
			type: DataTypes.BOOLEAN,
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
