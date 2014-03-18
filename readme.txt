/**********************************************************************************************************************
 Griddl - the little grid
***********************************************************************************************************************
You're a front-end developer. You know how to write JavaScript. You know how to use CSS. You don't need a do
everything bloated grid.

We're a simple display grid that provides basic functionality that handles 90% of use cases. We are very
light-weight. No fancy stuff just a simple, easy to use grid.

Our philosophy:
We believe in separation of layout from code. Because of the desire to keep the code-base simple, we aren't giving
you layout properties for every little display feature. You want the pager to the right instead of the left. Switch
the float by overriding the css. Don't like the bare, spartan footer, want a little formatting. Go ahead, add some css.

Do you have a unique layout. Don't even want to put the pager or page info in the footer. You can do that. We give you
the hooks and expose the properties you need.

IMPORTANT:
    * Right now we require jQuery but we will be removing that dependency.
    * We supply a very basic pager with First, Prev, Next, Last buttons. If you need more functionality we built
        griddl to work with external pagers. Why did we do this? 1) we want to stay light. A pager would
        more than double our code base. 2) we believe in a uniformed look and think a pager can be used throughout
        your app. Decoupling the pager from the grid means more flexibility. There are tons of good pagers out
        there with different looks and features. If our basic pager doesn't work for you, pick one you like and
        plug it in (see demo page) where we use simplePagination.js (http://flaviusmatis.github.io/simplePagination.js/)
***********************************************************************************************************************

=====================================================================================================================
 Features
=====================================================================================================================
* Lightweight. Provided css for basic customization or use your own.
* Give Griddl an array of Javascript objects (models), tell it the properties from the model you want to show as
    columns and you are done.
* Sorting
    * provided default (by data type)
    * custom sorting (optional) - provide your own functions per column
    * ability to turn off sorting on a per column basis
    * replace our default sort routines with your own
* Formatting (optional) - use a custom data formatting function per column
* Table dynamically created for you. No need to start with one like other grids.
* Decoupled presentation aspects of; the pager, # of items per page, and
    page information (ie, 20 - 29 of 265), from the grid. This allows very flexible
    layouts.

=====================================================================================================================
 How To Use
=====================================================================================================================
    -----------------------------------------------------------
    Initialization
    -----------------------------------------------------------
    1) Initialize Griddl by instantiating a new grid:

        var grid = new griddl.grid('containerSelector', settings);

        * containerSelector - a selector that will hold the grid
        * settings - a settings object (see below)
    2) Create you grid by calling render, passing in your data: grid.render(myData);

    -----------------------------------------------------------
    Grid Settings - a JavaScript object with the following properties.
    -----------------------------------------------------------
    * selectableRows (optional, default = false) - fires the onRowSelect callback, adds css classes for
        highlighting rows on select and hover
    * keyField (optional, default = undefined) - specify the field from the model that is passed back as
        parameter to onRowSelect callback. Sets data-gdl-key as an attribute on the row.
    * perPage (optional, default = 10) - number of model records per page to display
    * columns: array of griddl.Column objects that define the columns for the grid (see documentation
        on griddl.Column for column properties below and in griddl.js).
    * showFooter (optional, default = true) - determines if griddle shows a footer. The footer is where
        our default pager shows or where you can place your own pager. It also where page info is
        shown and items per page drop-down shows.
    * showPageInfo (optional, default = true) - determines if "20-29 of 265" language is displayed in
        the footer. showFooter must be set to true.
    * showPerPage (optional, default = true) - determines if a drop down allowing the user to set the
        number of items per page displays. showFooter must be set to true.
    * showPager (optional, default = true) - shows griddl's pager. showFooter must be set to true. Set to false
        if you want to use your own pager.
    * searcher (optional): custom grid search function that takes 2 parameters, model and searchString. Return
        true to signify a search match.

    CALLBACKS (optional)
    * onSort: callback that is called when the grid is sorted. Passed a griddl.Column object.
    * onRowSelect: callback that is called when a row is clicked. Passed the keyField for the row.
        Must have selectable Rows turned on.
    * onPerPageChange: callback that tells you when the user changed the per page setting.=, if using the
        internal per page widget. If using an external pager you should fix it up as appropriate in this
        callback. Passed the new number per page.
    * onPagerPage: callback that tells you when the user changed the page using the built in pager. Passed
        the page number.
    * onInit: callback the lets you know when the grid is ready (domready). If you are incorporating your own
        pager into the footer, this is when you would attach it to the footer panel. Passed # of rows loaded.

    -----------------------------------------------------------
    Grid Properties (read only = setting them will have no affect)
    -----------------------------------------------------------
    * data - the data feed to the grid. Initially set in your call to griddl.render
    * settings - the original setting passed in the constructor
    * containerSelector (read only) - the selector you used when constructing the grid
    * displayInfo (read only) - string describing the current grid state, for instance, "10 - 19 of 65"
    * firstShownIndex (read only) - index of the first row currently shown in the grid
    * rowCount (read only) - total number of rows in the grid
    * currentPage (read only) - current page number

    -----------------------------------------------------------
    Grid Methods
    -----------------------------------------------------------
    * render(data) - call after you create a griddl.grid object to have it created.

        var grid = new griddl.Grid('.griddl-container', griddlSettings);
        grid.render(gdlRepository.getEmployeeData());

    * page(pageNumber) - show the specified page number in the grid. If using your own pager, hook it up to this.

        grid.page(10);

    * search(searchString) - runs a search against the searcher. Returns # results.

    * clearSearch - re-populates the grid with the initial data

    * generateColumns(columnKeys /* optional */) - auto generate columns. If no columnKeys passed generates column
        for every field in the dataset. Otherwise pass an array of field names. For instance: ['first','last']
    -----------------------------------------------------------
    Column Properties
    -----------------------------------------------------------
    * fieldName - The name of the field in the data model you want to display in the column
    * displayName - The column header display
    * width - The column width percentage
    * sorter (optional, default = griddl.sortType.STRING) - A griddl.sortType or a function.
    * formatter (optional) - A function that is called when outputting the column data
    * currentSortOrder (optional, default = griddl.columnSortOrder.NONE) - a griddl.columnSortOrder. Use to
        signify to griddl the initial sorted state of a column of data.

    -----------------------------------------------------------
    CSS Classes
    -----------------------------------------------------------
    * gdl-content - internal wrapper around table
    * gdl-table - the main table
    * gdl-ascending, gdl-descending - added to column for styling based on sort order
    * gdl-col-N - where N is a column number. Allows css formatting by column. Added to TD and TH cells.
    * gdl-col-sortable - added to columns that can be sorted
    * gdl-row-empty - added to extra rows when not there are not enough model rows to fill the grid
    * gdl-row-selectable - added to rows when selectableRows setting is turned on
    * gdl-row-selected - added to the current active row (clicked) when selectableRows is turned on
    * gdl-panel-pager - the footer div where you will place your pager.
    * gdl-pager - the internal pager
    * gdl-button-enabled - the internal pager's enabled buttons
    * gdl-panel-info - the footer div that houses page info.
    * gdl-panel-perPage - the footer div that houses the per page select.


=====================================================================================================================
 Notes
=====================================================================================================================
Ajax - Our methodology is that you give griddl the data you want to display. If you do not want to load all your
data as once, you could easily catch OnPagerPage (or your own pager's page event) and also Griddl's onSort event to
make ajax calls to get the appropriate data. Then just set the returned data into griddl.data and call
griddl.page(1) to refresh the grid with your new data.

=====================================================================================================================
 Version History
=====================================================================================================================
 0.1.0 - 2012/08/25 Create basic grid, pager hook up, column sorting
 0.2.0 - 2012/09/14 Page info display, per page settings, row selection
 0.3.0 - 2012/09/23 Custom sorting and custom column formatting
 0.4.0 - 2012/09/29 Handle multiple grids per page
 0.4.1 - 2012/09/29 Update readme
 0.4.2 - 2012/09/30 Externalize page info
 0.4.3 - 2012/10/01 Handle boolean fields, added formatter object, added classes to cells for easier styling
 0.5.0 - 2012/10/03 Per page support
 0.5.1 - 2012/10/04 More demos, ascending and descending images, tweak some css
 0.6.0 - 2012/10/05 Create built-in pager and demo pages to support it
 0.7.0 - 2014/01/15 Searching support, auto-build columns, updated demos and readme
 0.8.0 - 2014/02/01 Bug fix when clearing search and pager bug. Add tests. Add minified version. Syntax highlighting
                    through Prism in demos
 0.8.1 - 2014/02/01 Reorganize project, separate demo folder
 0.8.2 - 2014/02/01 Use grunt to concat, minify, and copying files to demo folder
 0.8.3 - 2014/02/02 Split main js file. JSDoc comments.
 *********************************************************************************************************************/
