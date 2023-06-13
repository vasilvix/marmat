import React from 'react';

import classes from './MarmatSection.module.css';

const MarmatItem = (props) => {
    return (
        <button
            className={classes["marmat-start__item"]}
            onClick={props.onSectionClick}
        >
            <span>
                {props.name}
            </span>
        </button>
    );
};

export default MarmatItem;
