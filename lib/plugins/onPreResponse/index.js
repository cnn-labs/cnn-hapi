exports.register = (server, {cacheControlHeader, customHeaders = [], hasHeaders, shouldSetDefaultCacheControl, surrogateCacheControl}, next) => {
    server.ext({
        type: 'onPreResponse',
        method: function (request, reply) {
            if (shouldSetDefaultCacheControl(hasHeaders(request))) {
                request.response.header('Cache-Control', cacheControlHeader);
            }

            if (typeof hasHeaders(request) === 'object') {
                request.response.header('Surrogate-Control', surrogateCacheControl);

                customHeaders.length > 0 &&
                    customHeaders
                        .filter((header) => typeof header.name !== 'undefined' &&
                            typeof header.value !== 'undefined')
                        .filter((header) => header.name !== 'Cache-Control')
                        .filter((header) => header.name !== 'Surrogate-Control')
                        .forEach((header) => request.response.header(header.name, header.value));
            }

            reply.continue();
        }
    });

    next();
};

exports.register.attributes = {
    name: 'cnn-hapi-onPreResponse'
};
