// global.ts
import * as log from "./utility/logger.js";
import * as helper from "./utility/helper.js";
import * as response from "./utility/response-code.js";

// Declare global types and variables
declare global {
  var logHttp: typeof log.logHttp;
  var apiResponse: typeof helper.apiResponse;
  var getHashPassword: typeof helper.getHashPassword;
  var verifyPassword: typeof helper.verifyPassword;
  var safeJson: typeof helper.safeJson;
  var generateUUID: typeof helper.generateUUID;
  var ResponseCategory: typeof response.ResponseCategory;
}

// Assign to global object
global.logHttp = log.logHttp;
global.apiResponse = helper.apiResponse;
global.getHashPassword = helper.getHashPassword;
global.verifyPassword = helper.verifyPassword;
global.safeJson = helper.safeJson;
global.generateUUID = helper.generateUUID;
const ResponseCategory = response.ResponseCategory;
global.ResponseCategory = ResponseCategory;

export {};
