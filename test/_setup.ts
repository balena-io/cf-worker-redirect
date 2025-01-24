// set up global namespace for worker environment
// import * as makeServiceWorkerEnv from "service-worker-mock";
// declare var global: any;
// const env = makeServiceWorkerEnv();
// delete env.navigator;
// Object.assign(global, env);

import data from "./kv.json";

global.REDIRECT_KV = {
  data,
  get: async (key: string) => {
    // Return data you want for testing
    // console.log("get", key);
    return global.REDIRECT_KV.data[key];
  },
  put: async (key: string, value: string) => {
    // Put is NOOP in this project
    return false;
  }
};