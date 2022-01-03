import * as React from 'react';
import { Navbar } from './nav';
import logo from '../../assets/img/logo/pawcon-logo.png';

export function Header() {
  return (
    <div>
      <img id="logo" 
           src={logo} 
           loading='lazy'
           alt="pawcon logo" />
      <Navbar />
    </div>
  );
}