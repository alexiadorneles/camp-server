import { Model, Sequelize, DataTypes, ModelStatic, ModelAttributes, InitOptions, Optional } from 'sequelize'

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
}
