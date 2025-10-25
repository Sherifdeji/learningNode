import React from 'react';

import './Auth.css';

function Auth(props) {
  return (
    <React.Fragment>
      <section className='auth-form'>{props.children}</section>
    </React.Fragment>
  );
}

export default Auth;
