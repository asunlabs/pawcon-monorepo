import * as React from 'react';
import { ProfileProps } from '../containers/propContatiner';

export function Profile ({ name, email, isLoggedIn }: ProfileProps) {
  return (
    <div>
      <ul>
        <li>Hello, {name}. Welcome back!</li>
        <li>ID : {email}</li>
      </ul> 
    </div>
  );
}