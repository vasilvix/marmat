import { useRef, useState } from 'react';

import Input from '../../UI/Input';
import classes from './MarmatItemForm.module.css';

const MarmatItemForm = (props) => {
  const [amountIsValid, setAmountIsValid] = useState(true);
  const amountInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredAmount = amountInputRef.current.value;
    const enteredAmountNumber = +enteredAmount;

    if (
      enteredAmount.trim().length === 0 ||
      enteredAmountNumber < 1 ||
      enteredAmountNumber > 999
    ) {
      setAmountIsValid(false);
      return;
    }

    props.onAddToCart(enteredAmountNumber);
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <Input
        ref={amountInputRef}
        label='Количество'
        input={{
          id: `amount_${props.id}`,
          type: 'number',
          min: '1',
          max: '999',
          step: '1',
          defaultValue: '1',
        }}
      />
      <button>Добавить</button>
      {!amountIsValid && <p>Введите количество от 1 до 999.</p>}
    </form>
  );
};

export default MarmatItemForm;
