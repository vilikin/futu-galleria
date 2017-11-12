import config from '../config';

export const get = async (path) => {
    const response = await fetch(config.api + path);
    return await response.json();
};