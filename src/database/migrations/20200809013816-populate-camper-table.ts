import { QueryInterface } from 'sequelize'
import { CamperCreationAttributes } from '../../models'
import { BrazilianState, Country } from '../../types/Places'

export = {
	up: (queryInterface: QueryInterface, Sequelize: any) => {
		const camper: CamperCreationAttributes = {
			dsDescription: 'Eu sou eu, mto legal',
			dsInstagramNick: 'dornelesalexia',
			dsImageURL:
				'https://scontent.fpoa15-1.fna.fbcdn.net/v/t1.0-9/90265118_2969868963127288_13734059872092160_o.jpg?_nc_cat=108&_nc_sid=85a577&_nc_eui2=AeFBWOLNXSQhDdwag9CZOEFOfYKBnVOt5pV9goGdU63mlapLa5JmT-ovvJgYUBeIdW4acnoq_rGDlBSuL5-r0dYC&_nc_ohc=p6RIftc---QAX-_DoWy&_nc_ht=scontent.fpoa15-1.fna&oh=190857ef91c27dba9f95c634d669f2df&oe=5F532E72',
			nrDiscordID: 1,
			tpCountry: Country.BRAZIL,
			tpState: BrazilianState.RS,
			idCabin: 6,
			dtBirth: new Date(),
			dsName: 'Aléxia Dorneles',
			dsPronouns: 'ela/dela',
		}
		return queryInterface.bulkInsert('campers', [camper])
	},

	down: (queryInterface: QueryInterface, Sequelize: any) => {},
}
