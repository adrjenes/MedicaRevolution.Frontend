import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TokenContextProps {
  token: string | null;
  saveToken: (token: string) => void;
  removeToken: () => void;
}

const TokenContext = createContext<TokenContextProps | undefined>(undefined);

export const useToken = (): TokenContextProps => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};

interface TokenProviderProps {
  children: ReactNode;
}

export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const saveToken = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);  
  };

  const removeToken = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <TokenContext.Provider value={{ token, saveToken, removeToken }}>
      {children}
    </TokenContext.Provider>
  );
};