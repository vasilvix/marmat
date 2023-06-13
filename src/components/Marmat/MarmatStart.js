import { Fragment, useEffect, useState } from 'react';
import MarmatSection from './MarmatSection/MarmatSection';

import bx24 from '../../bx24/bx24';

import classes from './MarmatStart.module.css';

const MarmatStart = (props) => {
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();

  const sectionClickHandler = (id) => {
    props.onSelectCatalog(id);
  }

  useEffect(() => {
    setIsLoading(true);
    bx24.fetchMarmatSections()
      .then((items) => {
        setSections(() => items);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setHttpError(error.message);
      });
  }, []);

  if (isLoading) {
    return (
      <section className={classes.marmat_loading}>
        <p>Загрузка...</p>
      </section>
    );
  }

  if (httpError) {
    return (
      <section className={classes.marmat_error}>
        <p>Ошибка: {httpError}</p>
      </section>
    );
  }

  const marmatSectionList = sections.map((item) => (
    <MarmatSection
      key={item.id}
      id={item.id}
      name={item.name}
      onSectionClick={sectionClickHandler.bind(null, item.id)}
    />
  ));

  return (
    <Fragment>
      <section className={classes["section-start"]}>
        <div className={classes["marmat-start"]}>
          {marmatSectionList}
        </div>
      </section >
    </Fragment >
  );
};

export default MarmatStart;
