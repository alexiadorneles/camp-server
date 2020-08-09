import Sequelize, { Options } from 'sequelize'

import databaseConfig from '../config/database'

class Database {
	public connection: Sequelize.Sequelize

	constructor() {
		this.init()
	}

	init(): void {
		this.connection = new Sequelize.Sequelize(databaseConfig as Options)
	}
}

const database: Database = new Database()
export default database
