import _ from 'lodash'

export enum Divinity {
	ZEUS = 'Zeus',
	HERA = 'Hera',
	POSEIDON = 'Poseidon',
	DEMETER = 'Demeter',
	ARES = 'Ares',
	ATHENA = 'Atena',
	APOLLO = 'Apolo',
	ARTEMIS = 'Ártemis',
	HEPHAESTUS = 'Hefesto',
	APHRODITE = 'Afrodite',
	HERMES = 'Hermes',
	DIONYSUS = 'Dionísio',
	HADES = 'Hades',
	IRIS = 'Íris',
	HYPNOS = 'Hipnos',
	NEMESIS = 'Nêmesis',
	NIKE = 'Nike',
	HEBE = 'Hebe',
	TYCHE = 'Tique',
	HECATE = 'Hécate',
}

export const OLYMPIAN_TO_CABIN_NUMBER: {
	[key in Divinity]: number
} = {
	Zeus: 1,
	Hera: 2,
	Poseidon: 3,
	Demeter: 4,
	Ares: 5,
	Atena: 6,
	Apolo: 7,
	['Ártemis']: 8,
	Hefesto: 9,
	Afrodite: 10,
	Hermes: 11,
	Dionísio: 12,
	Hades: 13,
	Íris: 14,
	Hipnos: 15,
	Nêmesis: 16,
	Nike: 17,
	Hebe: 18,
	Tique: 19,
	Hécate: 20,
}

export const CABIN_NUMBER_TO_OLYMPIAN: {
	[key in number]: Divinity
} = _.fromPairs(_.toPairs(OLYMPIAN_TO_CABIN_NUMBER).map(([divinity, num]: [Divinity, number]) => [num, divinity]))
