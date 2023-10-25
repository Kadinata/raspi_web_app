import React from 'react';
import AlertBar from './AlertBar';

const ErrorBar = (props) => (<AlertBar {...props} severity="error" />);
const WarningBar = (props) => (<AlertBar {...props} severity="warning" />);
const InfoBar = (props) => (<AlertBar {...props} severity="info" />);
const SuccessBar = (props) => (<AlertBar {...props} severity="success" />);

export {
  ErrorBar,
  WarningBar,
  InfoBar,
  SuccessBar,
};