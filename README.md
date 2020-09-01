
## Creating a Camp Edition
In order to start creating a new edition for the Camp, you need to follow a few steps procedures. It is needed, first, to create a `Edition` in the `editions` table. Then, to configure your Activities, you need to go to the `ActivityEditions` table and add a row matching each activity with the correct amount of points for your current edition. Good! Now, you can already starts collecting campers and opening the CabinRequest process in frontend.
After closing the cabin requests process, you need to decide which camper would be in each cabin and this will be shown in `CamperEditions` table. Only the rows in this table would be counted as the campers that are currently participating of your edition. It's easier and needed to set the current Cabin of each Camper in the `idCabin` field in `Campers` table.

## Generating Activities and Activities Options Tables
To create the rows in the `Activities` and `ActivityOptions` tables you need to use a .csv file. The .csv file is placed in the google drive folder regarding the Camp. When you're done with the file, download it and place it in `input` folder with the name of `activities.csv`. Then, all you need to do is call `http://localhost:3333/activities/generate` endpoint and the activities would be generated alongside its options. There's no need to worry about activity replication cause the activity description is checked before insertion.

## Generating Rounds
To create new rounds for your campers you need to do all the described above. After that, you're ready for starting the activities. All you gotta do is call the endpoint `http://localhost:3333/rounds/generate` with a `RoundConfig` object, example:
```
{
	"activitiesConfig": [
		{
			"nrQuantity": 2,
			"tpLevel": "MEDIUM",
			"type": "Quem sou eu?" 
		},
		{
			"nrQuantity": 1,
			"tpLevel": "EASY",
			"type": "Quem sou eu?" 
		}
	]
}
```
The types and levels need to match the enum `values` and not the keys. Don't forget to check that.

## Important commands
yarn sequelize migration:create --name=migration-name
yarn sequelize db:migrate


## How to create a new table from scratch:
- Create the model file inside Models structure
  - you can follow the example in the CabinModel and CamperModel structure
  - remember to keep the model class name equals to the singular version of this model in the database
  - don't forget to call init method and the end of the file
- First you need to use `yarn sequelize migration:create --name=migration-name` to create your migration
- Go to the migration file in the migrations folder and add the data structure
  - don't forget to type the createTable with the corresponding model
- Go to the associations file and add any association your model needs there