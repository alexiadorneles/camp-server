import { Includeable } from 'sequelize/types'
import { Cabin, Camper } from '../models'

Camper.associate = function() {
	this.belongsTo(Cabin, { foreignKey: 'idCabin', as: 'cabin' })
}

Cabin.associate = function() {
	this.hasMany(Camper, { foreignKey: 'idCabin', as: 'campers' })
}

Camper.associate()
Cabin.associate()

export const INCLUDE_CAMPER = { model: Camper, as: 'campers' } as Includeable
