import axios from 'axios'
import base64url from 'base64url'
import { Request, Response } from 'express'
import { CamperCreationAttributes } from 'models'
import { GoogleScope, GoogleUser } from 'types/Google'
import { GoogleParametersBuilder } from '../../builder/GoogleParametersBuilder'
import { JWTMediator } from '../routes/middlewares'
import { CamperService } from '../services/CamperService'

const { GOOGLE_KEY, GOOGLE_SECRET, BASE_URL, FRONTEND_URL } = process.env

export class GoogleController {
	constructor(private camperService: CamperService) {}

	public googleLoginOrRegister = async (req: Request, res: Response) => {
		const { code } = req.query as { code: string }
		const user = await this.getUserFromGoogle(code)
		let camper = await this.camperService.findByGoogleId(user.sub)

		if (!camper) {
			camper = await this.createNewCamper(user)
		}

		const token = JWTMediator.sign({
			idCamper: Number(camper.idCamper),
			password: '',
		})

		res.redirect(`${FRONTEND_URL}?idCamper=${camper.idCamper}&token=${token}`)
	}

	private createNewCamper = (user: GoogleUser) => {
		if (!user?.email) {
			console.error('-------------------------------------')
			console.error('NO GOOGLE USER FOUND OR NO EMAIL! User is:', JSON.stringify(user))
			console.error('-------------------------------------')
		}
		const camper: CamperCreationAttributes = {
			blRegisterCompleted: false,
			dsEmail: user.email,
			dsImageURL: user.picture,
			dsName: user.name,
			idGoogle: user.sub,
		}
		return this.camperService.create(camper)
	}

	private getUserFromGoogle = async (code: string): Promise<GoogleUser> => {
		const response = await axios.post(
			new GoogleParametersBuilder('https://oauth2.googleapis.com/token')
				.withClientId(GOOGLE_KEY)
				.withClientSecret(GOOGLE_SECRET)
				.withCode(code)
				.withRedirectURL(`${BASE_URL}/google/auth`)
				.withGrantType('authorization_code')
				.withScope(GoogleScope.USER_EMAIL)
				.build(),
		)

		console.log('--------------------------')
		console.log('SCOPE FOR USER IS: ', response.data.scope)
		console.log('--------------------------')

		const { id_token } = response.data
		const [_, payload] = id_token.split('.')
		return JSON.parse(base64url.decode(payload))
	}
}
