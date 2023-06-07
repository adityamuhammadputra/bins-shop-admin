import { createStore } from 'vuex'

import { auth } from './auth' 

export default createStore({
  state: {
    meta : {
      q:'',
      sort:'',
      page: 1,
      length: null,
      from:'',
      to:'',
      total: null,
      data : [],
    },
    config : {
      headers:{
        Authorization: (auth.state.user) ? 'Bearer ' + auth.state.user.accessToken : null,
      }
    },
    configFile : {
      headers:{
        Authorization: (auth.state.user) ? 'Bearer ' + auth.state.user.accessToken : null,
        'Content-Type': 'multipart/form-data',
      }
    },
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth
  }
})
