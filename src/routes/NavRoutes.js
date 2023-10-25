//===========================================================================
//  
//===========================================================================
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faColumns,
  faMicrochip,
  faChartColumn,
} from '@fortawesome/free-solid-svg-icons';

const NavRoutes = [
  {
    title: "System Info",
    path: "/systems",
    icon: <FontAwesomeIcon className="fa-sm fa-fw" icon={faChartColumn} />,
  },
  {
    title: "GPIO",
    path: "/gpio",
    icon: <FontAwesomeIcon className="fa-sm" icon={faMicrochip} />,
  },
];

export default NavRoutes;
//===========================================================================