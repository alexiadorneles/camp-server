import { Op } from 'sequelize'
import { Camper, CamperAttributes } from '../../models'

export class CamperService {
	public async findByEmail(dsEmail: string): Promise<Camper> {
		return Camper.findOne({ where: { dsEmail } })
	}

	public async findWhereIdCabinIsNotNull(): Promise<Camper[]>	{
		return Camper.findAll({ where: { idCabin: {[Op.not]: null } } })
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
