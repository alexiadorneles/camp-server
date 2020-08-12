import { Includeable } from 'sequelize/types'
import { Cabin, CabinRequest, Camper, Edition } from '../models'
import { Activity } from '../models/ActivityModel'
import { ActivityOption } from '../models/ActivityOptionModel'
import { Round } from '../models/RoundModel'

Camper.associate = function(): void {
	Camper.belongsTo(Cabin, { foreignKey: 'idCabin', as: 'cabin' })
	Camper.hasMany(CabinRequest, { foreignKey: 'idCamper', as: 'camper' })
	Camper.belongsToMany(Activity, { foreignKey: 'idCamper', through: 'CamperActivities' })
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
	CabinRequest.hasOne(Camper, { foreignKey: 'idCamper' })
}

Activity.associate = function(): void {
	Activity.hasMany(ActivityOption)
	Activity.belongsToMany(Camper, { foreignKey: 'idActivity', through: 'CamperActivities' })
	Activity.belongsToMany(Round, { through: 'RoundActivities' })
}

ActivityOption.associate = function(): void {
	ActivityOption.belongsTo(Activity, { foreignKey: 'idActivity' })
}

Round.associate = function(): void {
	Round.belongsToMany(Activity, { through: 'RoundActivities' })
}

Camper.associate()
Cabin.associate()
Edition.associate()
CabinRequest.associate()
Activity.associate()
ActivityOption.associate()
Round.associate()

export const INCLUDE_CAMPER = { model: Camper, as: 'campers' } as Includeable
