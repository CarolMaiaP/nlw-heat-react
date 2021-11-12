import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}

type AuthContextData = {
  user: User | null;
  signInUrl: string;
  signOut: () => void;

}

export const AuthContext = createContext({} as AuthContextData)

type AuthProvider = {
  children: ReactNode;
}

//colocar os retornos das chamadas do api
type AuthResponse = {
  token : string;
  user: {
    id: string;
    avatar_url: string; 
    name: string;
    login: string;
  }
}

  export function AuthProvider(props:AuthProvider){

    const [user, setUser] = useState<User | null>(null);

    const signInUrl= `https://github.com/login/oauth/authorize?scope=user&client_id=124c849a7e2b1b35679e`;

    async function signIn(githubCode: String){
    //essa rota vai devolver um retorno
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubCode,
    })

    //dividir o retorno em duas partes 
    const { token, user} = response.data;

    //salvar o token dentro do storage para ter salvo
    localStorage.setItem('@dowhile:token', token);
    
    api.defaults.headers.common.authorization = `Bearer ${token}`;

    setUser(user);
  }

  //Função de logout 
  function signOut(){
    setUser(null);
    localStorage.removeItem('@dowhile:token');
  }

  useEffect(() => {
    const token = localStorage.getItem('@dowhile:token');

    if(token){
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      //rotaprofile é do backend
      api.get<User>('profile').then(response => {
        setUser(response.data);
      })
    }

  }, []);


  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=')

    if(hasGithubCode){
      //tudo que vier antes do ?code= é a url sem o código
      //o que vier depois é o código
      const [urlWithoutCode, githubCode] = url.split('?code=')

      console.log({urlWithoutCode, githubCode});

      //limpar a url para o código não aparecer
      window.history.pushState({}, '', urlWithoutCode);

      signIn(githubCode)
    }

  }, []);

  return(
    <AuthContext.Provider value= {{signInUrl, user, signOut}}>
      {props.children}
    </AuthContext.Provider>
  );
}