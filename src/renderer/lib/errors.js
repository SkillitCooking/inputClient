'use strict';

function handleError(error) {
    console.log('error: ', error.message);
    return {
        error: error
    };
}

exports.handleError = handleError;