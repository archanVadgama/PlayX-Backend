// global.ts
import * as log from "./utility/logger.js";
import * as helper from "./utility/helper.js";
import * as response from "./utility/response-code.js";

// Declare global types and variables
declare global {
  let logHttp: typeof log.logHttp;
  let apiResponse: typeof helper.apiResponse;
  let getHashPassword: typeof helper.getHashPassword;
  let verifyPassword: typeof helper.verifyPassword;
  let ResponseCategory: typeof response.ResponseCategory;
}

// Assign to global object
global.logHttp = log.logHttp;
global.apiResponse = helper.apiResponse;
global.getHashPassword = helper.getHashPassword;
global.verifyPassword = helper.verifyPassword;
const ResponseCategory = response.ResponseCategory;
global.ResponseCategory = ResponseCategory;

export {};
