import { useSegments,useRouter, useNavigation } from 'expo-router';
import useAuth,{ LoginCredentials, LoginResponse } from './api/auth/useAuth';
import React,{useEffect} from 'react';


interface AuthContextType {
    login: (credentials: LoginCredentials) => Promise<LoginResponse | null>;
    logout: () => Promise<boolean>;
    checkAuthStatus: () => Promise<string | null>;
    isLoading: boolean;
    error: string | null;
    userRole: string | null;
    setUserRole: (role: string | null) => void;
  }

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)


export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const { login, logout, checkAuthStatus, isLoading, error } = useAuth();
    const [userRole, setUserRole] = React.useState<string | null>(null);
    const segments = useSegments();
    const router = useRouter();
    const [isNavigationReady, setNavigationReady] = React.useState(false);
    const rootNavigation = useNavigation();

    useEffect(()=>{
      const unsubscribe = rootNavigation.addListener('state',()=>{ setNavigationReady(true) })
      return function cleanup(){
          if(unsubscribe) unsubscribe();
      }
    },[rootNavigation])

    useEffect(()=>{
      if(!isNavigationReady) return;
      const inAuthGroup = segments[0] === '(auth)';

      if(userRole === null && !inAuthGroup){
          router.push("/signIn")
      }
      else if(userRole !== null && inAuthGroup){
          router.push("/");
      }
    },[isNavigationReady,userRole,router,segments])
    
    useEffect(() => {
        (async () => {
          const role = await checkAuthStatus();
          setUserRole(role);
        })();
    }, [checkAuthStatus]);

    return (
        <AuthContext.Provider 
        value={{ login,logout,checkAuthStatus,isLoading,error,userRole,setUserRole}}
        >
          {children}
        </AuthContext.Provider>
      );
}   


export const useAuthContext = (): AuthContextType => {
    const context = React.useContext(AuthContext);
    if (!context) {
      throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
  };