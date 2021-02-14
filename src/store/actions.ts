const createAction = (type: string) => (payload: any) => ({
  type,
  payload
})

export const LOGIN_ACTION = 'LOGIN_ACTION'
export const loginActionSuccess = createAction(LOGIN_ACTION)
