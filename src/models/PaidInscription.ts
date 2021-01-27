import { DataTypes, Model, Optional } from 'sequelize'
import database from '../database'
import { TimestampDependant } from '../types/Data'

export interface PaidInscriptionAttributes extends TimestampDependant {
	idPaidInscription: number
	dsEmail: string
	idCabin: number
	idEdition: string
	blActivated: string
}

export interface PaidInscriptionCreationAttributes
	extends Optional<PaidInscriptionAttributes, 'idPaidInscription' | 'createdAt' | 'updatedAt'> {}

export class PaidInscription extends Model<PaidInscriptionAttributes, PaidInscriptionCreationAttributes>
	implements PaidInscriptionAttributes {
	idPaidInscription: number
	idCabin: number
	idEdition: string
	dsEmail: string
	blActivated: string

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
