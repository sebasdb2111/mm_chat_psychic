// const axios = require('axios');
// import { apiUrl, statusCodes } from './global-variables.js';
//
// export function loginPsychic(loginData) {
//     return axios
//         .post(`${apiUrl}/auth/psychic/login`, loginData)
//         .then(function(response) {
//             if (response.status === statusCodes.accepted) {
//                 return response;
//             }
//         })
//         .catch(function(error) {
//             console.log(error);
//         });
// }
//
// export function createNewPsychic(psychicData) {
//     return axios
//         .post(`${apiUrl}/psychic`, psychicData)
//         .then(function(response) {
//             return response;
//         })
//         .catch(function(error) {
//             console.log(error);
//         });
// }
