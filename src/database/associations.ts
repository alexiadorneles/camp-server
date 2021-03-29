import { Includeable } from 'sequelize/types'
import {
	Activity,
	ActivityOption,
	Cabin,
	CabinRequest,
	Camper,
	CamperActivity,
	CamperEdition,
	Edition,
	Round,
} from '../models'

Camper.associate = function (): void {
	Camper.belongsTo(Cabin, { foreignKey: 'idCabin', as: 'cabin' })
	Camper.hasMany(CabinRequest, { foreignKey: 'idCamper', as: 'camper' })
	Camper.hasMany(CamperActivity, { foreignKey: 'idCamper' })
}

Cabin.associate = function (): void {
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

Edition.associate = function (): void {
	Edition.hasMany(CabinRequest, { foreignKey: 'idEdition' })
}

CabinRequest.associate = function (): void {
	CabinRequest.hasOne(Edition, { foreignKey: 'idEdition', as: 'edition' })
	CabinRequest.hasOne(Camper, { foreignKey: 'idCamper', as: 'camper', sourceKey: 'idCamper' })
	CabinRequest.hasOne(Cabin, { foreignKey: 'idCabin', as: 'firstOptionCabin' })
	CabinRequest.hasOne(Cabin, { foreignKey: 'idCabin', as: 'secondOptionCabin' })
	CabinRequest.hasOne(Cabin, { foreignKey: 'idCabin', as: 'thirdOptionCabin' })
}

Activity.associate = function (): void {
	Activity.hasMany(ActivityOption, { foreignKey: 'idActivity', as: 'options' })
	Activity.belongsToMany(Round, { through: 'RoundActivities', foreignKey: 'idActivity', as: 'rounds' })
	Activity.hasMany(CamperActivity, { foreignKey: 'idActivity', as: 'activity' })
}

ActivityOption.associate = function (): void {
	ActivityOption.belongsTo(Activity, { foreignKey: 'idActivity' })
}

Round.associate = function (): void {
	Round.belongsToMany(Activity, { through: 'RoundActivities', foreignKey: 'idRound', as: 'activities' })
	Round.hasOne(Camper, { foreignKey: 'idCamper', as: 'camper' })
}

CamperActivity.associate = function (): void {
	CamperActivity.hasOne(Camper, { foreignKey: 'idCamper', as: 'campers' })
	CamperActivity.hasOne(Activity, { foreignKey: 'idActivity', as: 'activity' })
	CamperActivity.hasOne(ActivityOption, { foreignKey: 'idActivityOption' })
}

CamperEdition.associate = function (): void {
	CamperEdition.hasOne(Camper, { foreignKey: 'idCamper', as: 'camper' })
	CamperEdition.hasOne(Cabin, { foreignKey: 'idCabin', as: 'cabin' })
	CamperEdition.hasOne(Edition, { foreignKey: 'idEdition', as: 'edition' })
}

Camper.associate()
Cabin.associate()
Edition.associate()
CabinRequest.associate()
Activity.associate()
ActivityOption.associate()
CamperActivity.associate()
Round.associate()
CamperEdition.associate()

export const INCLUDE_CAMPER = { model: Camper, as: 'campers' } as Includeable
export const INCLUDE_SINGLE_CAMPER = { model: Camper, as: 'campers', foreignKey: 'idCamper' } as Includeable

export type IndexedObject = { [key in string]: any }
