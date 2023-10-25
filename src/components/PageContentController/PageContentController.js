//===========================================================================
//  
//===========================================================================
import React from 'react';
import Loading from '../Loading';
import PageError from './PageError';
import PageContainer from './PageContainer';
import PageTitle from './PageTitle';

const PageContentDataContext = React.createContext({});

export const usePageContentData = () => {
  const context = React.useContext(PageContentDataContext);
  if (context === undefined) {
    throw new Error('usePageContentData must be used within a PageContentDataContext provider.');
  }
  return context;
}

export const PageContentController = ({ loading, error, data, title, children, ...props }) => {
  return (
    <PageContainer>
      {title && <PageTitle>{title}</PageTitle>}
      <Loading show={loading}>
        <PageError error={error}>
          <PageContentDataContext.Provider value={data}>
            {children}
          </PageContentDataContext.Provider>
        </PageError>
      </Loading>
    </PageContainer>
  );
};
//===========================================================================