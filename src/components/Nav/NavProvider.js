//===========================================================================
//  
//===========================================================================
import React from 'react';

export const NavContext = React.createContext(null);

const NavProvider = ({ routes, ...props }) => {
  const [navRoutes, setNavRoutes] = React.useState(routes || []);
  return (<NavContext.Provider value={{ routes: navRoutes }} {...props} />);
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