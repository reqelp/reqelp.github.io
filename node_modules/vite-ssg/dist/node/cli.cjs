'use strict';

const kolorist = require('kolorist');
const yargs = require('yargs');
const helpers = require('yargs/helpers');
const build = require('../shared/vite-ssg.45ed6849.cjs');
require('path');
require('module');
require('fs-extra');
require('vite');
require('jsdom');
require('@unhead/dom');
require('../shared/vite-ssg.e6991406.cjs');

yargs(helpers.hideBin(process.argv)).scriptName("vite-ssg").usage("$0 [args]").command(
  "build",
  "Build SSG",
  (args) => args.option("script", {
    choices: ["sync", "async", "defer", "async defer"],
    describe: "Rewrites script loading timing"
  }).option("mock", {
    type: "boolean",
    describe: "Mock browser globals (window, document, etc.) for SSG"
  }).option("config", {
    alias: "c",
    type: "string",
    describe: "The vite config file to use"
  }),
  async (args) => {
    const { config: configFile = void 0, ...ssgOptions } = args;
    await build.build(ssgOptions, { configFile });
  }
).fail((msg, err, yargs2) => {
  console.error(`
${kolorist.gray("[vite-ssg]")} ${kolorist.bold(kolorist.red("An internal error occurred."))}`);
  console.error(`${kolorist.gray("[vite-ssg]")} ${kolorist.reset(`Please report an issue, if none already exists: ${kolorist.underline("https://github.com/antfu/vite-ssg/issues")}`)}`);
  yargs2.exit(1, err);
}).showHelpOnFail(false).help().argv;
