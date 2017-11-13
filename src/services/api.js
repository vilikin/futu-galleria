import config from '../config';

export const get = async (path) => {
    const response = await fetch(config.api + path);

    if (!response.ok) {
        throw new Error();
    }

    return await response.json();
};