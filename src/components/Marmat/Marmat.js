import { useEffect, useState } from 'react';

import bx24 from '../../bx24/bx24';

import MarmatItem from './MarmatItem/MarmatItem';
import classes from './Marmat.module.css';

const Marmat = (props) => {
    const [marmat, setMarmat] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState();

    useEffect(() => {
        setIsLoading(true);
        bx24.fetchMarmatItems(props.catalog)
            .then((items) => {
                setMarmat(() => items);
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                setHttpError(error.message);
            });
    }, [props.catalog]);

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

    const marmatList = marmat.map((item) => (
        <MarmatItem
            key={item.id}
            id={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.images.length > 0 ? item.images[0] : ''}
        />
    ));

    return (
        <section className={classes["section-products"]}>
            <div className={classes["products-items"]}>
                {marmatList}
            </div>
        </section>
    );
};

export default Marmat;
