import { Camper, CamperAttributes } from '../../models'

export class CamperService {
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
