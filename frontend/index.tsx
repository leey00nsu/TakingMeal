import React, { FunctionComponent } from 'react'
import App from './App'
import store from './redux/store'
import { Provider } from 'react-redux'
import { AppRegistry } from 'react-native'
import { name as appName } from './app.json'

const Wrapper: FunctionComponent = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

AppRegistry.registerComponent(appName, () => Wrapper)
