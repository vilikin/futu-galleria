import config from '../config';

export const pageOfPhotos = (page) => ({
    path: `/photos?_limit=${config.photosPerPage}&page=${page}`,
    id: `photos_page_${page}`
});

export const singlePhoto = (id) => ({
    path: `/photos/${id}`,
    id: `photo_id_${id}`
});