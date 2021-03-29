import { Op } from 'sequelize'
import { TwitterClient } from 'twitter-api-client'
import { Mission } from '../models/MissionModel'

const { TWITTER_KEY, TWITTER_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_TOKEN_SECRET, TWITTER_ACCOUNT } = process.env

const twitterClient = new TwitterClient({
	apiKey: TWITTER_KEY,
	apiSecret: TWITTER_SECRET,
	accessToken: TWITTER_ACCESS_TOKEN,
	accessTokenSecret: TWITTER_TOKEN_SECRET,
})

// different congratulation messages
const congratulations = ['Parabéns! Você concluiu a 3a Missão. Quais serão as consequências de sua vitória?']

export async function watchForMissionWinner(): Promise<void> {
	console.log('Watching for winner...')
	const currentMission = await Mission.findOne({ where: { idWinner: { [Op.is]: null } } })
	if (!currentMission) return
	const challenges = [currentMission]

	await Promise.all(
		challenges
			.filter(c => c.idWinner === null)
			.map(async challenge => {
				const { dsQuestionTag, dsAnswer } = challenge

				// search for correct answers (max 100 every five mins)

				const search = await twitterClient.tweets.search({
					q: `${dsAnswer} (${dsQuestionTag}) (to:${TWITTER_ACCOUNT})`,
					result_type: 'recent',
				})
				console.log('Query is::: ', `${dsAnswer}(${dsQuestionTag}) (to:${TWITTER_ACCOUNT})`)

				// get relevant info and order by time of tweet (oldest to newest)
				const data = search.statuses
					.map(({ id_str, user, text, created_at }) => {
						return {
							id: id_str,
							user: { id: user.id_str, screen_name: user.screen_name },
							text,
							created_at,
						}
					})
					.sort((a, b) => {
						return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
					})

				const winner = data && data[0]
				if (winner) {
					console.log('winner:', winner)
					console.log('update winner_status')

					await Mission.update({ idWinner: winner.id }, { where: { idMission: currentMission.idMission } })

					// TODO update winner_status prop on MYSql
					// tweet to winner
					try {
						const newStatus = await twitterClient.tweets.statusesUpdate({
							status: congratulations[Math.floor(Math.random() * congratulations.length)],
							in_reply_to_status_id: data[0].id,
							auto_populate_reply_metadata: true,
						})
						console.log('Respondido!!')
					} catch (err) {
						console.error(JSON.stringify(err))
					}
				} else {
					console.log(`no winner for ${dsQuestionTag} yet...`)
				}
			}),
	)
}
