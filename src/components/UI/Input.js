import React from 'react';

import classes from './Input.module.css';

const Input = React.forwardRef((props, ref) => {
  return (
    <div>
      <input className={classes.input} ref={ref} {...props.input} />
      <label htmlFor={props.input.id}>{props.label}</label>
    </div>
  );
});

export default Input;
