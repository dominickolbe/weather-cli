#!/usr/bin/env node

import axios from 'axios';
import ora from 'ora';
import chalk from 'chalk';

const spinner = ora('Loading ...');

const getWeatherData = async location => {
  try {
    const response = await axios.get('https://query.yahooapis.com/v1/public/yql', {
      params: {
        q: (`select item.condition from weather.forecast where woeid in (select woeid from geo.places(1) where text='${location}') and u='c'`),
        format: 'json',
      }
    });
    return response.data.query.results.channel.item.condition
  } catch (e) {
    return null;
  }
}

(async () => {

  const userInput = process.argv[2];

  spinner.start();

  const response = await getWeatherData(userInput);

  if (!response) {
    spinner.fail('Something went wrong!');
    process.exit(1);
  }

  spinner.succeed('Weather report:\n');

  const temperature = chalk.green.bold.inverse(` ${response.temp}°C `)
  const location = chalk.blue.bold(` ${userInput.toLocaleUpperCase()} `)

  console.log(`It's ${temperature} in ${location}\n`);

})();
