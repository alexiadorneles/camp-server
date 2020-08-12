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

export interface ActivityOptionAttributes extends TimestampDependant {
	idActivityOption: number
	idActivity: number
	dsOption: string
	blCorrect: boolean
}

export interface ActivityOptionCreationAttribute extends Optional<ActivityOptionAttributes, 'idActivityOption'> {}

export class ActivityOption extends Model<ActivityOptionAttributes, ActivityOptionCreationAttribute>
	implements ActivityOptionAttributes {
	idActivityOption: number
	idActivity: number
	dsOption: string
	blCorrect: boolean
	// timestamps!
	public readonly createdAt!: Date
	public readonly updatedAt!: Date

	public static tableName = 'ActivityOptions'

	public static associations: {}
	static associate: () => void
}

ActivityOption.init(
	{
		idActivityOption: {
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
			type: DataTypes.BIGINT,
		},
		idActivity: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		blCorrect: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		dsOption: {
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
