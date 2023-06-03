import axios from 'axios';
import authHeader from './auth-header';

// const API_URL = 'http://sisdm.local/api/auth/';
const API_URL = 'https://belajar-sisdm.bpk.go.id/api/auth/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }
}

export default new UserService();