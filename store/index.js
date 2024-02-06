import { createStore } from 'vuex'
import { app, user, theme } from './modules'
import getters from './getters'

const store = createStore({
  modules: {
    app,
    user,
    theme
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
export default store