import React from 'react';
import {Col} from "react-bootstrap";

import './ImageCard.scss';

export const ImageCard = ({thumbnailUrl}) => (
    <img className="image-card" src={thumbnailUrl} alt=""/>
);