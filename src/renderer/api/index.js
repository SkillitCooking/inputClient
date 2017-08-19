'use strict';

/**
 * TODO - could probably have better returned-error-from-server
 * handling... like 422 validation errors probably don't get 'caught'
 * in the try/catch statement
 */

import users from './users';
import tags from './tags';
import units from './units';
import seasonings from './seasonings';
import ingredients from './ingredients';
import recipes from './recipes';

export {
   users,
   tags,
   units,
   seasonings,
   ingredients,
   recipes
}