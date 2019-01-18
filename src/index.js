#!/usr/bin/env node

require('dotenv').config();

import axios from 'axios';
import ora from 'ora';
import chalk from 'chalk';

const spinner = ora('Loading ...');
const API_BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';

const getWeatherData = async query => {
  try {
    const { data } = await axios.get(API_BASE_URL, {
      params: {
        q: query,
        APPID: process.env.API_KEY,
      },
    });
    return {
      location: data.name,
      temp: data.main.temp - 273.15,
    };
  } catch (e) {
    return null;
  }
}

(async () => {
  spinner.start();

  const userInput = process.argv[2] || 'berlin';
  const response = await getWeatherData(userInput);

  if (!response) {
    spinner.fail('Something went wrong!');
    process.exit(1);
  }

  spinner.succeed('Weather report:\n');

  const temperature = chalk.bgGreen.black.bold(` ${response.temp}°C `);
  const location = chalk.blue.bold(`${response.location}`);

  console.log(`It's ${temperature} in ${location}\n`);
})();
