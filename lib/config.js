'use strict';


const _ = require('lodash');
const hasHeaders = require('./helpers').hasHeaders;
const path = require('path');
const Joi = require('joi');

class Config {

    constructor({description, name, version}, options, basePath) {

        const internals = {
            defaults: {
                basePath: basePath,
                cacheControlHeader: process.env.CACHE_CONTROL || 'max-age=60',
                customHeaders: options.customHeaders || [],
                description: options.description || description,
                environment: process.env.ENVIRONMENT || process.env.NODE_ENV || options.environment || '',
                healthChecks: options.healthChecks || [],
                host: process.env.HOST || options.host || '0.0.0.0',
                loaderIoValidationKey: options.loaderIoValidationKey || undefined,
                maxListeners: process.env.DEFAULT_MAX_LISTENERS || options.maxListeners || 10,
                name: options.name || name,
                port: process.env.PORT || options.port || 3000,
                services: options.services || null,
                surrogateCacheControl: process.env.SURROGATE_CACHE_CONTROL || options.surrogateCacheControl || 'max-age=360, stale-while-revalidate=60, stale-if-error=86400',
                tls: process.env.TLS || options.tls || null,
                version: version,
                withGoodConsole: options.withGoodConsole || false,
                withSwagger: options.withSwagger || false
            }
        };

        internals.schema = {
            basePath: Joi.string()
                .description('directory of the current process')
                .example('/Users/mjr'),
            cacheControlHeader: Joi.string()
                .description('maximum cache lifetime in seconds')
                .example('max-age=60'),
            customHeaders: Joi.array(),
            description: Joi.string()
                .description('a description of the application')
                .example('CNN Hapi'),
            environment: Joi.string()
                .description('application environment')
                .example('dev'),
            healthChecks: Joi.array(),
            host: Joi.string()
                .description('application host')
                .example('0.0.0.0'),
            loaderIoValidationKey: Joi.string()
                .description('loader.io validation'),
            layoutsDir: Joi.string()
                .description('the application view')
                .example('`${__dirname}/views/`'),
            maxListeners: Joi.number().integer()
                .description('max listeners per event')
                .example(1000),
            metrics: Joi.object().keys({
                provider: Joi.object(),
                options: Joi.object()
            }),
            name: Joi.string()
                .description('application name')
                .example('cnn-hapi'),
            port: Joi.number().integer()
                .description('application port')
                .example(3000),
            services: Joi.array()
                .description('an array of services to start before connections to hapi are allowed as well as stop after connections to hapi are disallowed'),
            surrogateCacheControl: Joi.string()
                .description('external cache layer')
                .example('max-age=360, stale-while-revalidate=60, stale-if-error=86400'),
            tls: Joi.any()
                .allow({}, null),
            version: Joi.string()
                .description('version of the application')
                .example('0.0.1'),
            withGoodConsole: Joi.boolean(),
            withSwagger: Joi.boolean()
        };

        this.settings = Object.assign(internals.defaults, options, {description, name, version});
        Joi.assert(this.settings, internals.schema, 'Invalid service configuration');
    }

    get cacheHeaders() {
        let cacheHeaders = Object.create(null);

        cacheHeaders.cacheControlHeader     = this.cacheControlHeader;
        cacheHeaders.surrogateCacheControl  = this.surrogateCacheControl;

        return cacheHeaders;
    }

    get connectionOptions() {
        let connectionOptions = Object.create(null),
            relativePath = (this.settings.layoutsDir !== undefined) ?
                path.join(this.settings.basePath, this.settings.layoutsDir) :
                this.settings.basePath;

        connectionOptions.host      = this.settings.host;
        connectionOptions.labels    = this.settings.environment || 'dev';
        connectionOptions.port      = this.settings.port;
        connectionOptions.tls       = (this.settings.tls) ? this.settings.tls : null;
        connectionOptions.routes    = (this.settings.routes) ? this.settings.routes : {};
        connectionOptions.routes.files  = {relativeTo: relativePath};
        connectionOptions.routes.cors   = {};
        connectionOptions.routes.state  = {};

        if (_.get(this.settings, 'connections.routes.files', false)) {
            connectionOptions.routes.files = this.settings.connections.routes.files;
        }

        if (_.get(this.settings, 'connections.routes.cors', false)) {
            connectionOptions.routes.cors = this.settings.connections.routes.cors;
        }

        if (_.get(this.settings, 'connections.routes.state', false)) {
            connectionOptions.routes.state = this.settings.connections.routes.state;
        }

        return connectionOptions;
    }

    /**
     * Set up cache control headers
     * @param {object} request - Request object
     * @param {object} headers - The cache control headers to set
     */
    setCacheControlHeaders(request, headers) {
        let surrogateControl = headers.surrogateCacheControl ? headers.surrogateCacheControl : false,
            cacheControl = headers.cacheControlHeader ? headers.cacheControlHeader : false;

        if (hasHeaders(request)) {
            surrogateControl === String(surrogateControl) && request.response.header('Surrogate-Control', surrogateControl);
            cacheControl === String(cacheControl) && request.response.header('Cache-Control', cacheControl);
        }
    }

    /**
     * Set up custom headers
     * @param {object} request - Request object
     * @param {object} customHeaders - The custome headers to set
     */
    setCustomHeaders(request, customHeaders = []) {
        let header,
            length,
            i = 0;

        if (hasHeaders(request) === true) {
            length = this.customHeaders.length;
            for (; i < length; i++) {
                header = customHeaders[i];
                if (header.name && header.value) {
                    request.response.header(header.name, header.value);
                }
            }
        }
    }
}

module.exports = Config;
