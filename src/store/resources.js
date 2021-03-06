import config from '../config';

export const photosFromAlbum = (albumId) => ({
    // Path from which the resource should be loaded
    // Relative to the API URL specified in config
    path: `/albums/${albumId}/photos?_limit=${config.photosPerPage}&_page={page}`,

    // Identifier for the resource, used in store
    id: 'photos_of_album_' + albumId,

    // Makes resource behave like a paginated list, allowing path to
    // contain {page}, which is going to be replaced by a page number
    pagination: true
});

export const allPhotos = () => ({
    path: `/photos?_limit=${config.photosPerPage}&_page={page}`,
    id: 'all_photos',
    pagination: true
});

export const singlePhoto = (id) => ({
    path: '/photos/' + id,
    id: 'photo_' + id,
    pagination: false
});

export const albums = (userId) => ({
    path: '/users/' + userId + '/albums',
    id: 'albums_of_user_' + userId,
    pagination: false
});

export const users = () => ({
    path: '/users',
    id: 'users',
    pagination: false
});