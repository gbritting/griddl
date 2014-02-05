/**
 * A function that is called to sort a column's data
 * @typedef {function} sorterCallBack
 * @param {boolean} forAscending
 * @returns {function} a closure which takes a single parameter, forAscending, and returns a function that takes
 *   the two inputs you would normally expect in a javascript sort function. For instance,
 * @example
 *      function (forAscending) {
 *          return function (a, b) {
 *              if (forAscending)
 *                  // do ascending sort magic
 *              else
 *                  // do descending sort magic
 *          };
 *      }
 */

/**
 * A function that is called when outputting a column's data
 * @typedef {function} formatterCallBack
 * @param {object} model - the data model instance
 * @returns {*} - the formatted value
 * @example
 *      function (model) {
 *          return model.first + ' ' + model.last;
 *      }
 */

/**
 * Defines a grid column
 * @param {string} fieldName - The name of the field in the data model to display in the column.
 * @param {string} displayName - The string to use in the column header.
 * @param {number} [width=0] - The column width percentage. All columns should add up to 100.
 * @param {number | sorterCallBack} [sorter=griddl.sortType.STRING] - A griddl.sortType or a sorter callback
 * @param {formatterCallBack} [formatter] - formatter callback
 * @property {griddl.columnSortOrder} currentSortOrder=griddl.columnSortOrder.NONE
 * @constructor
 */
griddl.Column = function (fieldName, displayName, width, sorter, formatter) {
    this.fieldName = fieldName;
    this.displayName = displayName;
    this.sorter = sorter || (sorter === 0 ? sorter : griddl.sortType.STRING);
    this.formatter = formatter;
    this.width = width || 0;

    this.currentSortOrder = griddl.columnSortOrder.NONE;
};

/**
 * Determines if the column can be sorted
 * @returns {boolean}
 */
griddl.Column.prototype.getIsSortable = function () {
    return this.sorter !== griddl.sortType.NO_SORTING;
};

/**
 * Determines if the column is in ascending sort order
 * @returns {boolean}
 */
griddl.Column.prototype.getIsCurrentlyAscending = function () {
    return this.currentSortOrder === griddl.columnSortOrder.ASC;
};

/**
 * Reverses the column sort order flag or sets it to ascending if the column is currently not ordered
 */
griddl.Column.prototype.switchSortOrder = function () {
    this.currentSortOrder = this.currentSortOrder === griddl.columnSortOrder.NONE ?
        griddl.columnSortOrder.ASC :
        this.getIsCurrentlyAscending() ? griddl.columnSortOrder.DESC : griddl.columnSortOrder.ASC;
};
