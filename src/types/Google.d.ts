export interface GoogleUser {
	iss: string
	azp: string
	aud: string
	sub: string
	email: string
	email_verified: boolean
	at_hash: string
	name: string
	picture: string
	given_name: string
	family_name: string
	locale: string
	iat: number
	exp: number
}

export const enum GoogleScope {
	USER_INFO = 'https://www.googleapis.com/auth/userinfo.profile',
	USER_EMAIL = 'https://www.googleapis.com/auth/userinfo.email',
}
