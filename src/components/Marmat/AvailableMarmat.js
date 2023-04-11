import {useEffect, useState} from 'react';

import bx24 from '../../bx24/bx24';

import MarmatItem from './MarmatItem/MarmatItem';
import classes from './AvailableMarmat.module.css';

const AvailableMarmat = () => {
    const [marmat, setMarmat] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState();

    useEffect(() => {
        const fetchMarmat = async () => {
            const productResponse = await bx24.call('crm.product.list', {
                'filter': {
                    'SECTION_ID': '7008',
                    "ACTIVE": "Y"
                },
                'select': [
                    'ID', 'NAME', 'PRICE', 'PROPERTY_2134', 'PROPERTY_1244'
                ]
            });

            const loadedMarmat = [];

            productResponse.forEach(e => {
                loadedMarmat.push({
                    id: e['ID'],
                    name: e['NAME'],
                    description: e['PROPERTY_2134'].value,
                    price: parseFloat(e['PRICE']),
                    images: e['PROPERTY_1244'].map(i => i.value.showUrl)
                });
            });

            setMarmat(loadedMarmat);
            setIsLoading(false);
        };

        fetchMarmat().catch((error) => {
            setIsLoading(false);
            setHttpError(error.message);
        });
    }, []);

    if (isLoading) {
        return (
            <section className={classes.MarmatLoading}>
                <p>Загрузка...</p>
            </section>
        );
    }

    if (httpError) {
        return (
            <section className={classes.MarmatError}>
                <p>{httpError}</p>
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
        <section className={classes.marmat}>
            <ul>{marmatList}</ul>
        </section>
    );
};

export default AvailableMarmat;
