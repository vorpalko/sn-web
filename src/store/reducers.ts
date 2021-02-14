import { combineReducers } from 'redux'
import { LOGIN_ACTION } from './actions'

export interface UserStore {
    isAdmin: boolean;
    hasAuth: boolean;
    userName: string;
}

export interface Store {
    user: UserStore;
}

const initalUserStore:UserStore = {
  isAdmin: false,
  userName: '',
  hasAuth: false
}

const userReducer = (state = initalUserStore, action: {type: any, payload: any}): UserStore => {
  switch (action.type) {
    case LOGIN_ACTION: return {
      isAdmin: action.payload.isAdmin,
      hasAuth: true,
      userName: action.payload.userName
    }
    case 'LOGOUT': return {
      isAdmin: false,
      hasAuth: false,
      userName: ''
    }
    default: return state
  }
}

export default combineReducers({
  user: userReducer
})
