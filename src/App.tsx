/* eslint-disable no-use-before-define */
import React from 'react'
import { connect, Provider } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import store from './store'
import { LoginScreen } from './pages/login'
import { Store } from './store/reducers'
import AdminLayerWrapper from './components/AdminRouter'
import KeyboardMain from './pages/keyboard-main'

const GuardBase = ({ children, user }: any) => {
  return user.hasAuth ? children : <LoginScreen/>
}

const RouteGuard = connect(({ user }: Store) => ({ user }), undefined)(GuardBase)

const AdminSwitch = ({ user, children }: {user: any, children: any}): any => {
  // eslint-disable-next-line no-constant-condition
  return user.isAdmin ? children : <Redirect to="/keyboard" />
}

const AdminGuard = connect(({ user }: Store) => ({ user }), undefined)(AdminSwitch) as any;

function App () {
  return (
    <Provider store={store}>
      <RouteGuard>
        <Switch>
          <Route path="/keyboard"><KeyboardMain /></Route>
          <Route
            path="/admin"
            render={(props) => (
              <AdminGuard {...props}>
                <AdminLayerWrapper baseUrl="/admin"/>
              </AdminGuard>
            )}
          />
          <Route exact path="/" render={(props) => (
            <AdminGuard {...props}>
              <Redirect to="/admin/users"/>
            </AdminGuard>)}
          />
        </Switch>
      </RouteGuard>
    </Provider>
  )
}

export default App;
