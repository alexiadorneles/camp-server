import { Builder } from 'types/Builder'
import { GoogleScope } from 'types/Google'

export class GoogleParametersBuilder implements Builder<string> {
	private code: string
	private cliendId: string
	private clientSecret: string
	private redirectURL: string
	private grantType: string
	private scope: string
	private accessType: string
	private includeGrantedScopes: string
	private responseType: string

	constructor(private baseURL: string) {}

	build(): string {
		const params = [
			this.code,
			this.cliendId,
			this.clientSecret,
			this.redirectURL,
			this.grantType,
			this.scope,
			this.accessType,
			this.includeGrantedScopes,
			this.responseType,
		]
			.filter(Boolean)
			.join('&')
		return `${this.baseURL}?${params}`
	}

	withCode(code: string) {
		this.code = `code=${code}`
		return this
	}

	withClientId(cliendId: string) {
		this.cliendId = `client_id=${cliendId}`
		return this
	}

	withClientSecret(clientSecret: string) {
		this.clientSecret = `client_secret=${clientSecret}`
		return this
	}

	withRedirectURL(redirectURL: string) {
		this.redirectURL = `redirect_uri=${redirectURL}`
		return this
	}

	withGrantType(grantType: string) {
		this.grantType = `grant_type=${grantType}`
		return this
	}

	withScope(scope: GoogleScope) {
		this.scope = `scope=${scope}`
		return this
	}

	withAccessType(accessType: string) {
		this.accessType = `access_type=${accessType}`
		return this
	}

	withIncludeGrantedScopes(includeGrantedScopes: boolean) {
		this.includeGrantedScopes = `include_granted_scopes=${includeGrantedScopes}`
		return this
	}

	withResponseType(responseType: string) {
		this.responseType = `include_granted_scopes=${responseType}`
		return this
	}
}
