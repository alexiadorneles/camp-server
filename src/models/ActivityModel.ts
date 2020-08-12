import { Model, Optional, DataTypes } from 'sequelize'
import { TimestampDependant } from '../types/Data'
import database from '../database'

export enum ActivityType {
	QUIZ = 'Quiz',
	MISSION = 'Missão',
	WHO_SAID = 'Quem disse?',
	DYSLEXIA = 'Dislexia',
	PROPHECY = 'Profecy',
}

// export interface Round {
// 	idRound: number
// 	idEdition: number
// 	dtBegin: Date
// 	dtEnd: Date | null
// 	blFinished: boolean
// }

// export interface RoundActivity {
// 	idRound: number
// 	idActivity: number
// }

export enum Level {
	EASY,
	MEDIUM,
	HARD,
}

// export interface ObjectiveAnswer {
// 	idAlternative: number
// 	idQuestion: number
// 	dsAlternative: string
// 	blCorrect: boolean
// }

// export interface EssayActivity {
// 	idQuestion: number
// 	idActivity: number
// 	dsQuestion: string
// }

// export interface CamperActivity {
// 	idCamper: number
// 	idActivity: number
// 	blCorrect: boolean
// }

export interface ActivityAttributes extends TimestampDependant {
	idActivity: number
	dsQuestion: string
	tpLevel: Level
	tpActivity: ActivityType
	// options?: ObjectiveAnswer[]
}

export interface ActivityCreationAttribute extends Optional<ActivityAttributes, 'idActivity'> {}

export class Activity extends Model<ActivityAttributes, ActivityCreationAttribute> implements ActivityAttributes {
	idQuestion: number
	idActivity: number
	dsQuestion: string
	tpLevel: Level
	tpActivity: ActivityType
	// timestamps!
	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	public static tableName = 'activities'

	public static associations: {}
	static associate: () => void
}

Activity.init(
	{
		idActivity: {
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
			type: DataTypes.BIGINT,
		},
		dsQuestion: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		tpActivity: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		tpLevel: {
			type: DataTypes.STRING,
			allowNull: false,
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
