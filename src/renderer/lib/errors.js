'use strict';

function handleError(error) {
    console.log('error: ', error);
    return {
        error: error
    };
}

exports.handleError = handleError;