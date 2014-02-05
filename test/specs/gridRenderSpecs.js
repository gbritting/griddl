describe('grid render suite', function () {
    var grid;

    $('body').append('<div class="griddl-render-test"></div>');

    beforeEach(function () {
        grid = new griddl.Grid('.griddl-render-test');
    });

    afterEach(function () {
        $('.griddl-render-test').empty();
    });

    it('should throw an exception if you call render more than once', function () {
        var data = griddl.specDataRepository.getPeople();
        grid.render(data);

        expect(grid.render.bind(grid, data)).toThrow();
    });

    it('should throw an exception if you do not pass an array for the data parameter', function () {
        var e = 'griddl: data parameter must be an [] of model objects.';
        var people = griddl.specDataRepository.getPeople();

        expect(grid.render.bind(grid, '')).toThrow(e);
        expect(grid.render.bind(grid, 10)).toThrow(e);
        expect(grid.render.bind(grid, false)).toThrow(e);
        expect(grid.render.bind(grid, null)).toThrow(e);
        expect(grid.render.bind(grid, undefined)).toThrow(e);
        expect(grid.render.bind(grid, people[0])).toThrow(e);
        expect(grid.render.bind(grid, people)).not.toThrow();
    });

    it('should set data into the data property', function () {
        var data = griddl.specDataRepository.getPeople();
        grid.render(data);

        expect(grid.data.length).toBe(10);
    });

    it('should automatically generate columns if not explicitly set', function () {
        spyOn(grid, 'generateColumns');

        grid.render([{ "name": "bob"}]);

        expect(grid.generateColumns).toHaveBeenCalled();
    });

    it('should not generate column if explicitly set', function () {
        grid.settings.columns.push(new griddl.Column('name', 'Name'));
        spyOn(grid, 'generateColumns');
        grid.render(griddl.specDataRepository.getPeople());

        expect(grid.generateColumns).not.toHaveBeenCalled();
    });

    describe('build grid shell suite', function () {
        var grid;
        var container;

        $('body').append('<div class="griddl-grid-shell-test"></div>');

        beforeEach(function () {
            grid = new griddl.Grid('.griddl-grid-shell-test');
            container = grid.getContainer();
        });

        afterEach(function () {
            $('.griddl-grid-shell-test').empty();
        });

        it('should create a colgroup with a col for each column', function () {
            grid.render(griddl.specDataRepository.getCompanies());

            expect(container.find('col').length).toBe(grid.settings.columns.length);
        });

        it('should set the width of each col in the colgroup if the column is set to a specific width', function () {
            var cols;
            grid.data = griddl.specDataRepository.getCompanies();
            grid.generateColumns();

            grid.settings.columns[0].width = 200;
            grid.render(griddl.specDataRepository.getCompanies());
            cols =  container.find('col');

            expect(cols.eq(0).attr('style')).toContain('width:200%');
            expect(cols.eq(1).attr('style')).toBeUndefined();
        });

        it('should create a table head for each column', function () {
            var heads;

            grid.render(griddl.specDataRepository.getCompanies());
            heads = container.find('thead > tr > th');
            
            expect(heads.length).toBe(grid.settings.columns.length);
        });

        it('should create a class for each head specifying its column number', function () {
            var heads, i;

            grid.render(griddl.specDataRepository.getCompanies());
            heads = container.find('thead > tr').first().find('th');

            for (i = 0; i < heads.length; i++) {
                expect(heads.eq(i).hasClass('gdl-col-' + i)).toBeTrue();
            }
        });

        it('should have a class specifying if the column is sortable', function () {
            var heads;
            var data = griddl.specDataRepository.getCompanies();

            grid.data = data;
            grid.generateColumns();
            grid.settings.columns[1].sorter = griddl.sortType.NO_SORTING;
            grid.render(data);
            heads = container.find('thead > tr').first().find('th');

            expect(heads.eq(0).hasClass('gdl-col-sortable')).toBeTrue();
            expect(heads.eq(1).hasClass('gdl-col-sortable')).toBeFalse();
        });

        it('should have a class specifying the current columns sort order', function () {
            var heads;
            var data = griddl.specDataRepository.getCompanies();

            grid.data = data;
            grid.generateColumns();
            grid.settings.columns[0].currentSortOrder = griddl.columnSortOrder.NONE;  // default
            grid.settings.columns[1].currentSortOrder = griddl.columnSortOrder.ASC;
            grid.settings.columns[2].currentSortOrder = griddl.columnSortOrder.DESC;
            grid.render(data);
            heads = container.find('thead > tr').first().find('th');

            expect(heads.eq(0).hasClass('gdl-ascending')).toBeFalse();
            expect(heads.eq(0).hasClass('gdl-descending')).toBeFalse();
            expect(heads.eq(1).hasClass('gdl-ascending')).toBeTrue();
            expect(heads.eq(2).hasClass('gdl-descending')).toBeTrue();
        });

        it('should have a span with the column displayName inside the head', function () {
            var headSpans;

            grid.render(griddl.specDataRepository.getCompanies());
            headSpans = container.find('thead > tr').first().find('th span');

            expect(headSpans.eq(0).text()).toBe('Id');
            expect(headSpans.eq(1).text()).toBe('Company');
            expect(headSpans.eq(2).text()).toBe('Phone');
            expect(headSpans.eq(3).text()).toBe('State');
            expect(headSpans.eq(4).text()).toBe('IsPublic');
        });

        it('should create a footer with a single cell that spans all the columns', function () {
            var cell;

            grid.render(griddl.specDataRepository.getCompanies());
            cell = container.find('tfoot > tr > td');

            expect(cell[0].getAttribute('colspan')).toBe(grid.settings.columns.length.toString());
        });

        it('should create a panel in the footer to hold the pager', function () {
            var footer;

            grid.render(griddl.specDataRepository.getCompanies());
            footer = container.find('tfoot');

            expect(footer.find('.gdl-panel-pager').length).toBe(1);
        });

        it('should show the default pager when the showPager setting is true', function () {
            var pagerPanel;

            grid.render(griddl.specDataRepository.getCompanies());
            pagerPanel = container.find('tfoot .gdl-panel-pager');

            expect(pagerPanel.find('.gdl-pager').length).toBe(1);
        });

        it('should not show the default pager when the showPager setting is false', function () {
            var pagerPanel;

            grid.settings.showPager = false;
            grid.render(griddl.specDataRepository.getCompanies());
            pagerPanel = container.find('tfoot .gdl-panel-pager');

            expect(pagerPanel.html().length).toBe(0);
        });

        it('should create a panel in the footer to hold the per page control, and page info', function () {
            var footer;

            grid.render(griddl.specDataRepository.getCompanies());
            footer = container.find('tfoot');

            expect(footer.find('.gdl-panel-perPage').length).toBe(1);
        });

        it('should show the per page control when the showPerPage setting is true', function () {
            var perPagePanel;

            grid.render(griddl.specDataRepository.getCompanies());
            perPagePanel = container.find('tfoot .gdl-panel-perPage');

            expect(perPagePanel.find('select').length).toBe(1);
        });

        it('should not show the per page control when the showPerPage setting is false', function () {
            var perPagePanel;

            grid.settings.showPerPage = false;
            grid.render(griddl.specDataRepository.getCompanies());
            perPagePanel = container.find('tfoot .gdl-panel-perPage');
            
            expect(perPagePanel.html().length).toBe(0);
        });

        it('should select the per page option to match the users setting of perPage', function () {
            var perPageSelect;
            var selectedValue;

            grid.settings.perPage = 50;
            grid.render(griddl.specDataRepository.getCompanies());
            perPageSelect = container.find('tfoot .gdl-panel-perPage select');
            selectedValue = perPageSelect[0].options[perPageSelect[0].selectedIndex].value;

            expect(selectedValue).toBe('50');
        });

        it('should create a panel in the footer to hold the page info', function () {
            var footer;

            grid.render(griddl.specDataRepository.getCompanies());
            footer = container.find('tfoot');

            expect(footer.find('.gdl-panel-info').length).toBe(1);
        });

        it('should wrap the table in a div with a special class', function () {
            grid.render(griddl.specDataRepository.getCompanies());

            expect(grid.getContainer().find('div > table').length).toBe(1);
        });

        it('should have a special class on the wrapping div and on the table', function () {
            grid.render(griddl.specDataRepository.getCompanies());

            expect(grid.getContainer().find('div.gdl-content > table.gdl-table').length).toBe(1);
        });
    });

    it('should call the onInit call back with the number of grid rows', function () {
        var cnt;
        var data = griddl.specDataRepository.getCompanies();

        grid.settings.onInit = function (rowCount) { cnt = rowCount; };
        grid.render(data);

        expect(cnt).toBe(data.length);
    });

    it('should start on page one', function () {
        spyOn(grid, 'page');
        grid.render(griddl.specDataRepository.getCompanies());

        expect(grid.page).toHaveBeenCalledWith(1);
    });

    describe('grid render event suite', function () {
        var grid, container;
        var BUTTON_FIRST = 0, BUTTON_PREV = 1, BUTTON_NEXT = 2, BUTTON_LAST = 3;

        $('body').append('<div class="griddl-render-event-test"></div>');

        beforeEach(function () {
            grid = new griddl.Grid('.griddl-render-event-test');
            container = grid.getContainer();
        });

        afterEach(function () {
            $('.griddl-render-event-test').empty();
        });

        it('should add a special class to the clicked row when selectableRows is on', function () {
            var rows;

            grid.settings.selectableRows = true;
            grid.render(griddl.specDataRepository.getCompanies());
            rows = container.find('tbody > tr');
            rows.eq(2).trigger('click');

            expect(rows.eq(2).hasClass('gdl-row-selected')).toBeTrue();
        });

        it('should run the onRowSelect call back when selectableRows is on and the user clicks a row', function () {
            var rows, settings;

            grid.settings.selectableRows = true;
            grid.settings.keyField = 'id';

            settings = grid.settings;
            spyOn(settings, 'onRowSelect');

            grid.render(griddl.specDataRepository.getCompanies());
            rows = container.find('tbody > tr');
            rows.eq(2).trigger('click');

            expect(settings.onRowSelect).toHaveBeenCalled();
        });

        it('should pass the row key to the selected row onRowSelect call back', function () {
            var rows;
            var keyFromEvent;
            var companies = griddl.specDataRepository.getCompanies();
            var rowSelect = function (key) { keyFromEvent = key; };

            grid.settings.selectableRows = true;
            grid.settings.keyField = 'id';
            grid.settings.onRowSelect = rowSelect;
            grid.render(companies);
            rows = container.find('tbody > tr');
            rows.eq(2).trigger('click');

            expect(keyFromEvent).toBe(companies[2].id);
        });

        // pager stuff
        it('should not take any action when clicking on a disabled button', function () {
            var pagerButtons;

            grid.render(griddl.specDataRepository.getLastNames());  // 314 records
            pagerButtons = container.find('.gdl-pager li');
            spyOn(grid, 'page');
            pagerButtons.eq(BUTTON_PREV).trigger('click');

            expect(grid.page).not.toHaveBeenCalled();
        });

        it('should move to the first page when clicking the first button', function () {
            var pagerButtons;

            grid.render(griddl.specDataRepository.getLastNames());  // 314 records
            pagerButtons = container.find('.gdl-pager li');
            pagerButtons.eq(BUTTON_LAST).trigger('click');

            spyOn(grid, 'page');
            pagerButtons.eq(BUTTON_FIRST).trigger('click');

            expect(grid.page).toHaveBeenCalledWith(1);
        });

        it('should move to the last page when clicking the last button', function () {
            var pagerButtons;

            grid.render(griddl.specDataRepository.getLastNames());  // 314 records
            spyOn(grid, 'page');
            pagerButtons = container.find('.gdl-pager li');
            pagerButtons.eq(BUTTON_LAST).trigger('click');

            expect(grid.page).toHaveBeenCalledWith(32);
        });

        it('should move to the next page when clicking the next button', function () {
            var pagerButtons;

            grid.render(griddl.specDataRepository.getLastNames());  // 314 records
            spyOn(grid, 'page');
            pagerButtons = container.find('.gdl-pager li');
            pagerButtons.eq(BUTTON_NEXT).trigger('click');

            expect(grid.page).toHaveBeenCalledWith(2);
        });

        it('should move to the previous page when clicking the prev button', function () {
            var pagerButtons;

            grid.render(griddl.specDataRepository.getLastNames());  // 314 records
            pagerButtons = container.find('.gdl-pager li');
            pagerButtons.eq(BUTTON_LAST).trigger('click');
            spyOn(grid, 'page');
            pagerButtons.eq(BUTTON_PREV).trigger('click');

            expect(grid.page).toHaveBeenCalledWith(31);
        });
        
        it('should run the onPagerPage callback when clicking a pager button', function () {
            var pagerButtons;
            var numberTimesCalled = 0;

            grid.settings.onPagerPage = function () { numberTimesCalled++; };
            grid.render(griddl.specDataRepository.getLastNames());
            pagerButtons = container.find('.gdl-pager li');

            pagerButtons.eq(BUTTON_LAST).trigger('click');
            expect(numberTimesCalled).toBe(1);

            pagerButtons.eq(BUTTON_PREV).trigger('click');
            expect(numberTimesCalled).toBe(2);

            pagerButtons.eq(BUTTON_NEXT).trigger('click');
            expect(numberTimesCalled).toBe(3);

            pagerButtons.eq(BUTTON_FIRST).trigger('click');
            expect(numberTimesCalled).toBe(4);
        });

        it('should pass the page number to the onPagerPage callback', function () {
            var pagerButtons;
            var pageNum = 0;

            grid.settings.onPagerPage = function (pageNumber) { pageNum = pageNumber; };
            grid.render(griddl.specDataRepository.getLastNames());
            pagerButtons = container.find('.gdl-pager li');

            pagerButtons.eq(BUTTON_LAST).trigger('click');
            expect(pageNum).toBe(32);

            pagerButtons.eq(BUTTON_PREV).trigger('click');
            expect(pageNum).toBe(31);

            pagerButtons.eq(BUTTON_NEXT).trigger('click');
            expect(pageNum).toBe(32);

            pagerButtons.eq(BUTTON_FIRST).trigger('click');
            expect(pageNum).toBe(1);
        });

        // per page select clicks
        it('should adjust the perPage setting to the new value from the select list', function () {
            var perPageSelect;

            expect(grid.settings.perPage).toBe(10);

            grid.render(griddl.specDataRepository.getCompanies());
            perPageSelect = container.find('.gdl-panel-perPage select');
            perPageSelect.val('50').trigger('change');

            expect(grid.settings.perPage).toBe(50);
        });

        it('should reset the grid to page one', function () {
            var perPageSelect;

            grid.render(griddl.specDataRepository.getCompanies());
            perPageSelect = container.find('.gdl-panel-perPage select');
            spyOn(grid, 'page');
            perPageSelect.val('20').trigger('change');

            expect(grid.page).toHaveBeenCalledWith(1);
        });
        
        it('should run the perPageChange callback', function () {
            var perPageSelect;
            var settings = grid.settings;

            spyOn(settings, 'onPerPageChange');
            grid.render(griddl.specDataRepository.getCompanies());
            perPageSelect = container.find('.gdl-panel-perPage select');
            perPageSelect.val('20').trigger('change');

            expect(settings.onPerPageChange).toHaveBeenCalled();
        });

        it('should pass the perPageChange callback the new number per page', function () {
            var newNumPerPage, perPageSelect;

            grid.settings.onPerPageChange = function (numPerPage) { newNumPerPage = numPerPage;};
            grid.render(griddl.specDataRepository.getCompanies());
            perPageSelect = container.find('.gdl-panel-perPage select');
            perPageSelect.val('50').trigger('change');

            expect(newNumPerPage).toBe(50);
        });

        // header sorting
        it('should not perform sorting if the column is not sortable', function () {
            var headings, beforeClickSortOrder;

            grid.render(griddl.specDataRepository.getCompanies());
            grid.settings.columns[1].sorter = griddl.sortType.NO_SORTING;
            headings = container.find('.gdl-table th');
            beforeClickSortOrder = grid.settings.columns[1].currentSortOrder;
            headings.eq(1).trigger('click');

            expect(grid.settings.columns[1].currentSortOrder).toBe(beforeClickSortOrder);
        });

        it('should switch the column currentSortOrder when sorting the column', function () {
            var headings, beforeClickSortOrder;

            grid.render(griddl.specDataRepository.getCompanies());
            headings = container.find('.gdl-table th');
            beforeClickSortOrder = grid.settings.columns[1].currentSortOrder;
            headings.eq(1).trigger('click');

            expect(grid.settings.columns[1].currentSortOrder).not.toBe(beforeClickSortOrder);
        });

        it('should call the correct internal sorter for the column sort type', function () {
            var headings;

            spyOn(griddl.sorter, 'byString');
            spyOn(griddl.sorter, 'byInt');
            spyOn(griddl.sorter, 'byFloat');
            spyOn(griddl.sorter, 'byDate');

            grid.render(griddl.specDataRepository.getCompanies());
            headings = container.find('.gdl-table th');
            headings.eq(1).trigger('click');
            
            expect(griddl.sorter.byString).toHaveBeenCalled();

            grid.settings.columns[1].sorter = griddl.sortType.INT;
            headings.eq(1).trigger('click');
            expect(griddl.sorter.byInt).toHaveBeenCalled();

            grid.settings.columns[1].sorter = griddl.sortType.FLOAT;
            headings.eq(1).trigger('click');
            expect(griddl.sorter.byFloat).toHaveBeenCalled();

            grid.settings.columns[1].sorter = griddl.sortType.DATE;
            headings.eq(1).trigger('click');
            expect(griddl.sorter.byDate).toHaveBeenCalled();
        });

        it('should run the custom sort if one is assigned to the column', function () {
            var headings, calledMySorter = false;

            function mySorter () { calledMySorter = true; }

            grid.render(griddl.specDataRepository.getCompanies());
            grid.settings.columns[1].sorter = mySorter;
            headings = container.find('.gdl-table th');
            headings.eq(1).trigger('click');

            expect(calledMySorter).toBeTrue();
        });

        it('should return to the first page', function () {
            var headings;

            grid.render(griddl.specDataRepository.getCompanies());
            spyOn(grid, 'page');
            headings = container.find('.gdl-table th');
            headings.eq(1).trigger('click');

            expect(grid.page).toHaveBeenCalledWith(1);
        });

        it('should call the onSort callback', function () {
            var headings, calledMyOnSort = false;

            function myOnSort () { calledMyOnSort = true; }

            grid.settings.onSort = myOnSort;
            grid.render(griddl.specDataRepository.getCompanies());
            headings = container.find('.gdl-table th');
            headings.eq(1).trigger('click');

            expect(calledMyOnSort).toBeTrue();
        });

        it('should return the column that was sorted in the onSort callback', function () {
            var headings, columnPassedToCallback;

            function myOnSort (column) { columnPassedToCallback = column; }

            grid.settings.onSort = myOnSort;
            grid.render(griddl.specDataRepository.getCompanies());
            headings = container.find('.gdl-table th');
            headings.eq(1).trigger('click');

            expect(columnPassedToCallback).toEqual(grid.settings.columns[1]);
        });

        it('should remove any ascending or descending classes from other columns', function () {
            var headings;

            grid.render(griddl.specDataRepository.getCompanies());
            headings = container.find('.gdl-table th');
            headings.eq(1).trigger('click');

            expect(headings.eq(1).hasClass('gdl-ascending')).toBeTrue();
            expect(headings.eq(1).hasClass('gdl-descending')).toBeFalse();

            headings.eq(2).trigger('click');
            expect(headings.eq(1).hasClass('gdl-ascending')).toBeFalse();
            expect(headings.eq(1).hasClass('gdl-descending')).toBeFalse();
        });

        it('should set the ascending or descending class accordingly', function () {
            var headings;

            grid.render(griddl.specDataRepository.getCompanies());
            headings = container.find('.gdl-table th');

            headings.eq(1).trigger('click');
            expect(headings.eq(1).hasClass('gdl-ascending')).toBeTrue();
            expect(headings.eq(1).hasClass('gdl-descending')).toBeFalse();

            headings.eq(1).trigger('click');
            expect(headings.eq(1).hasClass('gdl-ascending')).toBeFalse();
            expect(headings.eq(1).hasClass('gdl-descending')).toBeTrue();
        });
    });
});
