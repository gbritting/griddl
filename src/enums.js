/**
 * Enum for defining how to sort a column's data
 * @readonly
 * @enum {number}
 */
griddl.sortType = {
    NO_SORTING: 0,  // don't allow the column to be sorted
    STRING: 1,
    INT: 2,
    FLOAT: 3,
    DATE: 4,
    BOOL: 5
};

/**
 * Enum for describing the current sort order of a column
 * @readonly
 * @enum {number}
 */
griddl.columnSortOrder = {
    NONE: 0,
    ASC: 1,
    DESC: 2
};
