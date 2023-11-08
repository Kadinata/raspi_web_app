//===========================================================================
//  
//===========================================================================
import React from 'react';

export const NavContext = React.createContext(null);

const NavProvider = ({ routes, ...props }) => {
  return (<NavContext.Provider value={{ routes }} {...props} />);
};

export const useNavContext = () => {
  const context = React.useContext(NavContext);
  if (context === undefined) {
    throw new Error('useNavContext must be used within a NavProvider.');
  }
  return context;
}

export default NavProvider;
//===========================================================================