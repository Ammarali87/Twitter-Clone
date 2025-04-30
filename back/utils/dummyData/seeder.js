import { readFileSync } from 'fs';
import 'colors';
import { config } from 'dotenv';
import { create, deleteMany } from '../../models/productModel';
import dbConnection from '../../config/database';

config({ path: '../../config.env' });

// connect to DB
dbConnection();

// Read data
const products = JSON.parse(readFileSync('./products.json'));


// Insert data into DB
const insertData = async () => {
  try {
    await create(products);

    console.log('Data Inserted'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await deleteMany();
    console.log('Data Destroyed'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// node seeder.js -d
if (process.argv[2] === '-i') {
  insertData();
} else if (process.argv[2] === '-d') {
  destroyData();
}