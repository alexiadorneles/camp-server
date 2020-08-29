import bcrypt from 'bcryptjs'
import { DataTypes, Model, Optional } from 'sequelize'
import database from '../database'
import { TimestampDependant } from '../types/Data'

export interface AdminAttributes extends TimestampDependant {
	idAdmin: number
	dsName: string
	idGoogle: string
	dsEmail: string
	password: string
}

export interface AdminCreationAttributes extends Optional<AdminAttributes, 'idAdmin' | 'createdAt' | 'updatedAt'> {}

export class Admin extends Model<AdminAttributes, AdminCreationAttributes> implements AdminAttributes {
	idAdmin: number
	dsName: string
	idGoogle: string
	dsEmail: string
	password: string

	// timestamps!
	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	public static tableName = 'admins'

	static associate: () => void
}

Admin.init(
	{
		idAdmin: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
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
		dsName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			set: (value: string) => bcrypt.hashSync(value, 8),
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
