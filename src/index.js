#!/usr/bin/env node

import axios from "axios";
import chalk from "chalk";
import ora from "ora";

const spinner = ora("Loading ...");
const API_KEY = "be5f5b46d2ead9b77e35d1302c229266";
const API_BASE_URL = "http://api.openweathermap.org/data/2.5/weather";

const getWeatherData = async (query) => {
  try {
    const { data } = await axios.get(API_BASE_URL, {
      params: {
        q: query,
        APPID: API_KEY,
        units: "metric",
      },
    });
    return {
      location: data.name,
      temp: data.main.temp,
    };
  } catch (e) {
    return null;
  }
};

(async () => {
  spinner.start();

  const userInput = process.argv[2];
  const response = await getWeatherData(userInput);

  if (!response) {
    spinner.fail("Something went wrong!");
    process.exit(1);
  }

  spinner.succeed("Weather report:\n");

  const temperature = chalk.bgGreen.black.bold(
    ` ${response.temp.toFixed()}°C `
  );
  const location = chalk.blue.bold(`${response.location}`);

  console.log(`It's ${temperature} in ${location}\n`);
})();
