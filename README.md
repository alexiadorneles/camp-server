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