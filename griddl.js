/*!
 * griddl
 * Version: 0.8.3
 * Build Date: 2014-02-02
 * Copyright (c) 2014 Glenn Britting
 */
var griddl = griddl || {};

griddl.version  = '0.8.3';

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

/**
 * Object that holds formatter functions
 */
griddl.formatter = {
    bool: function (bool) {
        return bool ? 'Yes' : 'No';
    }
};

/**
 * Creates a Grid
 * @param {string} containerSelector - The selector that is the container for the grid
 * @param {object} [settings] - An object literal that sets up the grid
 *      @param {string} [settings.keyField=''] - specify the field from the model that is passed back as
 *      parameter to onRowSelect callback. Sets data-gdl-key as an attribute on the row.
 *      @param {boolean} [settings.selectableRows=false] - fires the onRowSelect callback, adds css classes for
 *      highlighting rows on select and hover
 *      @param {number} [settings.perPage=10] - number of model records per page to display
 *      @param {griddl.Column[]} [settings.columns=[]] - array of griddl.Column objects that define the columns for the grid
 *      @param {boolean} [settings.showFooter=true] - determines if griddle shows a footer. The footer is where our
 *      default pager shows or where you can place your own pager. It also where page info is shown and
 *      items per page drop-down shows.
 *      @param {boolean} [settings.showPageInfo=true] - determines if "20-29 of 265" language is displayed in the
 *      footer. showFooter must be set to true.
 *      @param {boolean} [settings.showPerPage=true] - determines if a drop down allowing the user to set the
 *      number of items per page displays. showFooter must be set to true.
 *      @param {boolean} [settings.showPager=true] - shows griddl's pager. showFooter must be set to true. Set to false
 *      if you want to use your own pager.
 *      @param {function} [settings.searcher] - custom grid search function that takes 2 parameters, model and
 *      searchString. Return true to signify a search match.
 *      @param {function} [settings.onSort] - callback that is called when the grid is sorted. Passed a griddl.Column object.
 *      @param {function} [settings.onRowSelect] - callback that is called when a row is clicked. Passed the keyField
 *      for the row. Must have selectableRows turned on.
 *      @param {function} [settings.onPerPageChange] - callback that tells you when the user changed the per page
 *      setting if using the internal per page widget. If using an external pager you should fix it up as appropriate
 *      using this callback. Passed the new number per page.
 *      @param {function} [settings.onPagerPage] - callback that tells you when the user changed the page
 *      using the built in pager. Passed the page number.
 *      @param {function} [settings.onInit] - callback the lets you know when the grid is ready (domready). If you
 *      are incorporating your own pager into the footer, this is when you would attach it to the footer
 *      panel. Passed # of rows loaded.
 * @property {object[]} data - the array of data passed into the render method
 * @property {object} settings - the settings passed into the constructor
 * @property {string} containerSelector - the containerSelector passed into the constructor (read only)
 * @property {string} displayInfo - string describing the current grid state, for instance, "10 - 19 of 65" (read only)
 * @property {number} firstShownIndex - index of the first row currently shown in the grid (read only)
 * @property {number} rowCount - total number of rows in the grid (read only)
 * @property {number} currentPage - current page number (read only)
 * @constructor
 */
griddl.Grid = function (containerSelector, settings) {
    var originalSelector = containerSelector;
    var container;

    this.containerSelector = containerSelector;
    this.settings = {
        keyField: '',
        selectableRows: false,
        perPage: 10,
        columns: [],
        showFooter: true,
        showPageInfo: true,
        showPerPage: true,
        showPager: true,
        searcher: function (model, searchString) { return false; },
        onSort: function (column) {},
        onRowSelect: function (rowKey) {},
        onPerPageChange: function (numberPerPage) {},
        onPagerPage: function (pageNumber) {},
        onInit: function (rowCount) {}
    };

    $.extend(this.settings, settings);

    this.displayInfo = '';
    this.firstShownIndex = 0;
    this.rowCount = 0;
    this.currentPage = 0;
    this.data = [];

    this._originalData = [];

    this.getContainer = function () {
        if (!container) {
            container = $(originalSelector);
        }
        return container;
    };
};

/**
 * Initiates a search, using Grid.searcher, through the full set of data passed into the render method
 * @param {string} searchString
 * @returns {number} - the number of results found
 */
griddl.Grid.prototype.search = function (searchString) {
    var searchResults = [];
    var searchFor = searchString.replace(/^\s+|\s+$/gm, '');

    if (this._originalData.length > 0) {
        this.data = this._originalData;
        this._originalData = [];
    }

    for (var i = 0; i < this.data.length; i++) {
        var model = this.data[i];

        if (this.settings.searcher(model, searchFor)) {
            searchResults.push(model);
        }
    }

    if (searchResults.length > 0 ) {
        this._originalData = this.data;
        this.data = searchResults;
        this.page(1);
    }

    return searchResults.length;
};

/**
 * Clears the search results from the grid and resets it with its original data.
 */
griddl.Grid.prototype.clearSearch = function () {
    if (this._originalData.length > 0) {
        this.data = this._originalData;
        this._originalData = [];
    }
    this.page(1);
};

/**
 * Generates an array of griddl.Column objects and sets them into Grid.settings. Generates a column for every property
 * in the model.
 * @param {string[]} [columnKeys] - use to limit the generated columns. An array of model properties.
 */
griddl.Grid.prototype.generateColumns = function (columnKeys) {
    var i, model, key;
    var keys = [];

    if (typeof columnKeys === 'undefined') {
        model = this.data[0];
        for (var field in model) {
            if (model.hasOwnProperty(field)) {
                keys.push(field);
            }
        }
    } else {
        keys = columnKeys;
    }

    for (i = 0; i < keys.length; i++) {
        key = keys[i];
        this.settings.columns.push(new griddl.Column(key, key.charAt(0).toUpperCase() + key.slice(1)));
    }
};

/**
 * Move the grid to another page
 * @param {number} pageNumber - the page number to move to
 */
griddl.Grid.prototype.page = function (pageNumber) {
    var model, emptyClass, cellClass;
    var tableData = '';
    var colOutput = '';
    var displayCount = 0;
    var settings = this.settings;
    var columns = settings.columns;
    var container = this.getContainer();
    var startIndex = (pageNumber - 1) * settings.perPage;

    if (!this._hasBeenRendered) {
        throw "griddl: You must call render before you call page.";
    }

    if (pageNumber < 1 || pageNumber > griddl.pager.calcMaxPage(this.data.length, settings.perPage)) {
        return;
    }

    this.rowCount = this.data.length;
    this.firstShownIndex = startIndex + 1;
    this.currentPage = pageNumber;

    for (var i = startIndex; i < (startIndex + settings.perPage); i++) {
        if (i >= this.rowCount ) {
            emptyClass = i === this.rowCount ? 'gdl-row-empty gdl-first' : 'gdl-row-empty';
            tableData += '<tr class="' + emptyClass + '"><td colspan="' + columns.length + '">&nbsp;</td>';
        } else {
            model = this.data[i];

            if (settings.selectableRows) {
                if (settings.keyField) {
                    tableData += '<tr class="gdl-row-selectable" data-gdl-key="' + model[settings.keyField] + '">';
                } else {
                    tableData += '<tr class="gdl-row-selectable">';
                }
            } else {
                tableData += '<tr>';
            }

            for (var j = 0; j < columns.length; j++){
                colOutput = typeof columns[j].formatter === 'function' ? columns[j].formatter(model) :
                    columns[j].sorter === griddl.sortType.BOOL ? griddl.formatter.bool(model[columns[j].fieldName]) :
                        model[columns[j].fieldName];

                cellClass = 'gdl-col-' + j;
                tableData += '<td class="' + cellClass + '">' + colOutput + '</td>';
            }

            displayCount++;
        }

        tableData += '</tr>';
    }

    container.find('.gdl-table > tbody').empty().html(tableData);

    this.displayInfo = this.firstShownIndex.toLocaleString() + ' - ' +
        (this.firstShownIndex + displayCount - 1).toLocaleString() + ' of ' + this.rowCount.toLocaleString();

    if (settings.showFooter) {
        if (settings.showPageInfo) {
            container.find('.gdl-panel-info').text(this.displayInfo);
        }

        if (settings.showPager) {
            griddl.pager.reset(container.find('.gdl-pager'), pageNumber, this.rowCount, settings.perPage);
        }
    }
};

/**
 * Renders the grid onto the page
 * @param {object[]} data - an array of model objects
 */
griddl.Grid.prototype.render = function (data) {
    var grid;
    var self = this;
    var columns = this.settings.columns;

    function buildGridShell() {
        var column, headerClass;
        var cols = '';
        var heads = '';
        var foot = '';

        for (var j = 0; j < columns.length; j++){
            column = columns[j];

            cols += columns[j].width ? '<col style="width:' + columns[j].width + '%;" >' : '<col>';
            headerClass = 'gdl-col-' + j;

            if (column.getIsSortable()) {
                headerClass += ' gdl-col-sortable';

                if (column.currentSortOrder !== griddl.columnSortOrder.NONE) {
                    headerClass += column.getIsCurrentlyAscending() ? ' gdl-ascending' : ' gdl-descending';
                }
            }

            heads += '<th class="' + headerClass + '"><span>' + column.displayName + '</span></th>';
        }

        if (self.settings.showFooter) {

            foot = '<tfoot><tr><td colspan="' + columns.length + '"><div class="gdl-panel-pager">';

            if (self.settings.showPager) {
                foot += griddl.pager.shell;
            }

            foot += '</div><div class="gdl-panel-perPage">';

            if (self.settings.showPerPage) {
                foot += griddl.perPage.build(self.settings.perPage);
            }

            foot += '</div><div class="gdl-panel-info"></div></td></td></tr></tfoot>';
        }

        return '<div class="gdl-content"><table class="gdl-table"><colgroup>' + cols + '</colgroup><thead><tr>' +
            heads + '</tr></thead>' + foot + '<tbody></tbody></table></div>';
    }

    function beforeSort (column) {
        column.switchSortOrder();
    }

    function sort (column) {
        if (column.sorter === griddl.sortType.INT) {
            griddl.sorter.byInt(self.data, column.fieldName, column.getIsCurrentlyAscending());
        } else if (column.sorter === griddl.sortType.FLOAT) {
            griddl.sorter.byFloat(self.data, column.fieldName, column.getIsCurrentlyAscending());
        } else if (column.sorter === griddl.sortType.DATE) {
            griddl.sorter.byDate(self.data, column.fieldName, column.getIsCurrentlyAscending());
        } else if (typeof column.sorter === 'function') {
            self.data.sort(column.sorter(column.getIsCurrentlyAscending()));
        } else {  // STRING, BOOL, OTHERS
            griddl.sorter.byString(self.data, column.fieldName, column.getIsCurrentlyAscending());
        }
    }

    function afterSort (column, index) {
        var container = self.getContainer();
        var headings = container.find('th');
        headings.removeClass('gdl-ascending gdl-descending');
        headings.eq(index).addClass(function () {
            return column.getIsCurrentlyAscending() ? 'gdl-ascending' : 'gdl-descending';
        });
    }

    if (this._hasBeenRendered) {
        throw "griddl: You can only call render once per grid. If you want to load new data to" +
            " an existing grid, set grid.data, and then call grid.page(1).";
    }

    if (!jQuery.isArray(data)) {
        throw "griddl: data parameter must be an [] of model objects.";
    }

    this._hasBeenRendered = true;
    self.data = data;

    if (this.settings.columns.length === 0) {
        //throw "griddl: You must set your columns. settings.columns should be an array of griddl.Column."
        this.generateColumns();
    }

    grid = buildGridShell();

    $(function (){
        var container = self.getContainer();
        container.prepend(grid);
        self.settings.onInit(self.data.length);
        self.page(1);

        if (self.settings.selectableRows) {
            container.find('.gdl-table > tbody').on('click', 'tr', function () {
                var row = $(this);
                var key = row.data('gdl-key');
                row.parent().find('tr').removeClass('gdl-row-selected');
                row.addClass('gdl-row-selected');
                self.settings.onRowSelect(key);
            });
        }

        if (self.settings.showFooter) {
            if (self.settings.showPager) {
                container.find('.gdl-pager').on('click', 'li', function () {
                    var li = $(this);
                    var pageNumber = 1;

                    if (li.hasClass('gdl-button-enabled')) {
                        pageNumber = parseInt(li.attr('data-number'), 10);
                        if (pageNumber === -1) {
                            pageNumber = griddl.pager.calcMaxPage(self.data.length, self.settings.perPage);
                        }

                        self.page(pageNumber);
                        self.settings.onPagerPage(pageNumber);
                    }
                });
            }
            if (self.settings.showPerPage) {
                container.find('.gdl-panel-perPage select').on('change', function () {
                    var numPerPage = parseInt($(this).val(), 10);
                    self.settings.perPage = numPerPage;
                    self.page(1);
                    self.settings.onPerPageChange(numPerPage);
                });
            }
        }

        container.find('.gdl-table th').on('click', function () {
            var index = $(this).index();
            var column = columns[index];

            if (!column.getIsSortable())
            {
                return;
            }

            beforeSort(column);
            sort(column);
            self.page(1);
            self.settings.onSort(column);
            afterSort(column, index);
        });
    });
};

/**
 * Helper for creating and managing the internal pager
 */
griddl.pager = {
    shell: '<ul class="gdl-pager"><li data-number="1">First</li><li>Prev</li><li>Next</li><li data-number="-1">Last</li></ul>',
    calcMaxPage: function (itemCount, itemsPerPage) {
        return Math.ceil(itemCount / itemsPerPage);
    },
    reset: function (pager, pageNumber, itemCount, itemsPerPage) {
        var pagerButtons = pager.find('li').removeClass('gdl-button-enabled');
        var page = parseInt(pageNumber, 10);
        var lastPage = this.calcMaxPage(itemCount, itemsPerPage);

        if (page === 1 && lastPage === 1) {
            pagerButtons.removeClass('gdl-button-enabled');
        } else if (page === 1) {
            pagerButtons.filter(":gt(1)").addClass('gdl-button-enabled');
        } else if (page >= lastPage) {
            pagerButtons.filter(":lt(2)").addClass('gdl-button-enabled');
        } else {
            pagerButtons.addClass('gdl-button-enabled');
        }

        pagerButtons.eq(1).attr('data-number', page - 1);
        pagerButtons.eq(2).attr('data-number', page + 1);
    }
};

/**
 * Helper for creating the internal per page select list
 */
griddl.perPage = {
    options: [10, 20, 50],
    build: function (initialValue) {
        var selected;
        var select = '<select>';

        for (var i = 0; i < this.options.length; i++){
            selected = this.options[i] === initialValue ? ' selected="selected"' : '';
            select += '<option value="' + this.options[i] + '"' + selected + '>' + this.options[i] + '</option>';
        }
        return select + '</select> per page';
    }
};

/**
 * Object that handles internal sorting
 */
griddl.sorter = {
    sortBy: function(field, reverse, primer) {
        var key = function (x) {return primer ? primer(x[field]) : x[field];};

        return function (a,b) {
            var A = key(a), B = key(b);
            return ( (A < B) ? -1 : ((A > B) ? 1 : 0) ) * [-1,1][+!!reverse];
        };
    },
    byString: function (data, field, sortAscending) {
        data.sort(this.sortBy(field, sortAscending, function(a) {
            if (typeof a !== 'string') {
                return a.toString().toUpperCase();
            }
            return a.toUpperCase();
        }));
    },
    byFloat: function (data, field, sortAscending) {
        data.sort(this.sortBy(field, sortAscending, parseFloat));
    },
    byInt: function (data, field, sortAscending) {
        data.sort(this.sortBy(field, sortAscending, parseInt));
    },
    byDate: function (data, field, sortAscending) {
        data.sort(this.sortBy(field, sortAscending, function(a) { return new Date(a);}));
    }
};
