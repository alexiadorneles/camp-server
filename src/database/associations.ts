import { Includeable, Model, ModelStatic } from 'sequelize/types'
import { Cabin, Camper, CabinRequest, CabinAttributes, CabinCreationAttributes, Edition } from '../models'

Camper.associate = function(): void {
	Camper.belongsTo(Cabin, { foreignKey: 'idCabin', as: 'cabin' })
	Camper.hasMany(CabinRequest, { foreignKey: 'idCamper', as: 'camper' })
}

Cabin.associate = function(): void {
	Cabin.hasMany(Camper, { foreignKey: 'idCabin', as: 'campers' })
	Cabin.belongsToMany(CabinRequest, {
		foreignKey: 'idFirstOptionCabin',
		as: 'firstOptionCabin',
		through: CabinRequest.tableName,
	})
	Cabin.belongsToMany(CabinRequest, {
		foreignKey: 'idSecondOptionCabin',
		as: 'secondOptionCabin',
		through: CabinRequest.tableName,
	})
	Cabin.belongsToMany(CabinRequest, {
		foreignKey: 'idThirdOptionCabin',
		as: 'thirdOptionCabin',
		through: CabinRequest.tableName,
	})
}

Edition.associate = function(): void {
	Edition.hasMany(CabinRequest)
}

CabinRequest.associate = function(): void {
	CabinRequest.hasOne(Edition, { foreignKey: 'idEdition' })
	CabinRequest.hasOne(Cabin, { foreignKey: 'idFirstOptionCabin' })
	CabinRequest.hasOne(Cabin, { foreignKey: 'idSecondOptionCabin' })
	CabinRequest.hasOne(Cabin, { foreignKey: 'idThirdOptionCabin' })
	CabinRequest.hasOne(Camper, { foreignKey: 'idCamper' })
}

Camper.associate()
Cabin.associate()
Edition.associate()
CabinRequest.associate()

export const INCLUDE_CAMPER = { model: Camper, as: 'campers' } as Includeable
