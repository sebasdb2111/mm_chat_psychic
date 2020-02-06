import axios from 'axios';
import { apiUrl, statusCodes } from './global-variables.js';

class AuthService {
    loginPsychic(loginData) {
        return axios
            .post(`${apiUrl}/auth/psychic/login`, loginData)
            .then(function(response) {
                if (response.status === statusCodes.accepted) {
                    localStorage.setItem('psychicToken', response.data);
                    return response;
                }
            });
    }
    logoutPsychic() {
      console.log('borra token')
        localStorage.removeItem('psychicToken');
    }
}

export default new AuthService();
