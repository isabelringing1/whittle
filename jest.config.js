/** @type {import('jest').Config} */
const config = {
  reporters: ["default", ["jest-ctrf-json-reporter", {}]],
};

export default config;
