import { Fragment } from 'react';

import classes from './MarmatStart.module.css';

const MarmatStart = (props) => {
  return (
    <Fragment>
      <section className={classes["section-start"]}>
        <div className={classes["marmat-start"]}>
          <button
            className={classes["marmat-start__item"]}
            onClick={props.selectCustomerCatalog}
          >
            <span>
              Клиентам
            </span>
          </button>
          <button
            className={classes["marmat-start__item"]}
            onClick={props.selectEmployeesCatalog}
          >
            <span>
              Сотрудникам
            </span>
          </button>
        </div>
      </section >
    </Fragment >
  );
};

export default MarmatStart;
