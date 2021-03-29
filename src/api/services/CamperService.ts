import { Op } from 'sequelize'
import { Camper, CamperActivity, CamperAttributes, CamperCreationAttributes } from '../../models'

export class CamperService {
	public async create(data: CamperCreationAttributes): Promise<Camper> {
		return Camper.create(data)
	}

	public async findByEmail(dsEmail: string): Promise<Camper> {
		return Camper.findOne({ where: { dsEmail } })
	}

	public async findByGoogleId(idGoogle: string): Promise<Camper> {
		return Camper.findOne({ where: { idGoogle } })
	}

	public async findWhereIdCabinIsNotNull(): Promise<Camper[]> {
		return Camper.findAll({ where: { idCabin: { [Op.not]: null } } })
	}

	public async statisticByCamperAndDate(date: string, idCamper: string) {
		const [year, month, day] = date.split('-').map(Number)
		const parsedDate = new Date(year, month - 1, day)
		const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 59)
		const answeredActivitiesOnDate = await CamperActivity.findAll({
			where: { idCamper, updatedAt: { [Op.between]: [parsedDate, endOfDay] } },
		})
		const corrects = answeredActivitiesOnDate.filter(ca => ca.blCorrect)
		const percentage = (corrects.length * 100) / answeredActivitiesOnDate.length || 0
		return { answeredActivitiesOnDate, corrects, percentage }
	}

	public async update(data: Partial<CamperAttributes>, whereClause: Partial<CamperAttributes>): Promise<Camper> {
		await Camper.update({ ...data }, { where: whereClause })
		const updatedCamper = await Camper.findOne({ where: whereClause })
		if (this.isCamperFullyRegistered(updatedCamper) && !updatedCamper.blRegisterCompleted) {
			await Camper.update({ blRegisterCompleted: true }, { where: whereClause })
		}

		return updatedCamper
	}

	private isCamperFullyRegistered(camper: Camper): boolean {
		return Boolean(camper.dsDiscordID && camper.dtBirth && camper.tpCountry && camper.dsInstagramNick)
	}
}
