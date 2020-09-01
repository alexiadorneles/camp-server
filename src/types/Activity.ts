export enum ActivityType {
	QUIZ = 'Quiz',
	MISSION = 'Missão',
	WHO_SAID = 'Quem disse?',
	DYSLEXIA = 'Dislexia',
	PROPHECY = 'Profecia',
	WHO_AM_I = 'Quem Sou Eu?',
}

export enum Level {
	EASY = 'EASY',
	MEDIUM = 'MEDIUM',
	HARD = 'HARD',
}

export interface ActivityConfig {
	tpActivity: ActivityType
	nrPoints: number
}
