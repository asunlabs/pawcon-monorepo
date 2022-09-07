module.exports = function override(config, env) {
    console.log('rewired');
    const fallbackOptions = {
        fallback: {
            path: require.resolve('path-browserify'),
            os: require.resolve('os-browserify/browser'),
        },
    };

    config.resolve = { ...config.resolve, ...fallbackOptions };

    return config;
};
