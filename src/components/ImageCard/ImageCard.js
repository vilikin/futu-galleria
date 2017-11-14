import React from 'react';

import './ImageCard.scss';

export const ImageCard = ({thumbnailUrl}) => (
    <img className="image-card" src={thumbnailUrl} alt=""/>
);