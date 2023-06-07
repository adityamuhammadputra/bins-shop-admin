import axios from 'axios';

class AuthService {
    login(user) {
      return axios
        .post('auth/login', {
          email: user.email,
          password: user.password,
          admin: true,
        })
        .then(response => {
            // console.log(response.data);
          if (response.data.accessToken) {
            localStorage.setItem('user', JSON.stringify(response.data));
          }
  
          return response.data;
        });
    }
  
    logout() {
      localStorage.removeItem('user');
    }
  
    // register(user) {
    //   return axios.post(API_URL + 'signup', {
    //     username: user.username,
    //     email: user.email,
    //     password: user.password
    //   });
    // }
  }
  
  export default new AuthService();