import { Includeable } from 'sequelize/types'
import { Cabin, CabinRequest, Camper, Edition, CamperActivity } from '../models'
import { Activity } from '../models/ActivityModel'
import { ActivityOption } from '../models/ActivityOptionModel'
import { Round } from '../models/RoundModel'

Camper.associate = function(): void {
	Camper.belongsTo(Cabin, { foreignKey: 'idCabin', as: 'cabin' })
	Camper.hasMany(CabinRequest, { foreignKey: 'idCamper', as: 'camper' })
	Camper.hasMany(CamperActivity, { foreignKey: 'idCamper' })
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
	Activity.hasMany(ActivityOption, { foreignKey: 'idActivity', as: 'options' })
	Activity.belongsToMany(Round, { through: 'RoundActivities' })
}

ActivityOption.associate = function(): void {
	ActivityOption.belongsTo(Activity, { foreignKey: 'idActivity' })
}

Round.associate = function(): void {
	Round.belongsToMany(Activity, { through: 'RoundActivities' })
}

CamperActivity.associate = function(): void {
	CamperActivity.hasOne(Camper, { foreignKey: 'idCamper' })
	CamperActivity.hasOne(Activity, { foreignKey: 'idActivity' })
	CamperActivity.hasOne(ActivityOption, { foreignKey: 'idActivityOption' })
}

Camper.associate()
Cabin.associate()
Edition.associate()
CabinRequest.associate()
Activity.associate()
ActivityOption.associate()
CamperActivity.associate()
Round.associate()

export const INCLUDE_CAMPER = { model: Camper, as: 'campers' } as Includeable

export type IndexedObject = { [key in string]: any }
