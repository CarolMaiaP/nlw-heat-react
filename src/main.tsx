import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import { AuthProvider } from './contexts/auth'

import './styles/global.css'


//adicionamos o authprovider na main para todos os componentes da aplicação terem acesso 
//aos dados que vamos colocar dentro do contexto(auth.tsx)
ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

