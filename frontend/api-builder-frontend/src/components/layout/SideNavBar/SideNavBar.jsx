import React from 'react';
import { Link } from 'react-router-dom';
import './SideNavBar.scss'

const SideNavbar = () => {
    return (
        <nav className="sidebar">
          <div className="sidebar__content">
          <ul className="sidebar__list">
            <li className="sidebar__item">
              <Link to="/" className="sidebar__link">Database</Link>
            </li>
            <li className="sidebar__item">
              <Link to="/api" className="sidebar__link">API</Link>
            </li>
          </ul>
          </div>
         
        </nav>
      );
};

export default SideNavbar;
