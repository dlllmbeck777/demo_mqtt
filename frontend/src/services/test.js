import { instance, config, unAuthConfig } from './baseApi.js';

// Making an authenticated GET request
instance.get('/some-protected-route', config())
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Making an unauthenticated GET request
instance.get('/some-public-route', unAuthConfig)
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

