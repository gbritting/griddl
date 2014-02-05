describe('grid pager suite', function () {
    var grid;
    var container;

    $('body').append('<div class="griddl-page-test"></div>');

    beforeEach(function () {
        grid = new griddl.Grid('.griddl-page-test');
        container = grid.getContainer();
    });

    afterEach(function () {
        $('.griddl-page-test').empty();
    });

    it('should throw an exception if you try to call page before rendering the grid', function () {
        expect(grid.page.bind(grid, 1)).toThrow('griddl: You must call render before you call page.');
    });

    it('should not execute the page function if the requested page number is less than one', function () {
        grid.render(griddl.specDataRepository.getCompanies());

        expect(grid.currentPage).toBe(1);

        grid.page(0);
        expect(grid.currentPage).toBe(1);
    });

    it('should not execute the page function if the requested page number is greater than possible number of pages', function () {
        grid.render(griddl.specDataRepository.getCompanies());

        expect(grid.currentPage).toBe(1);

        grid.page(999);
        expect(grid.currentPage).toBe(1);
    });

    it('should always reset the row count', function () {
        grid.render(griddl.specDataRepository.getCompanies());
        grid.rowCount = 99;
        grid.page(1);

        expect(grid.rowCount).toBe(grid.data.length);
    });

    it('should set the firstShownIndex based on the page and perPage count', function () {
        grid.settings.perPage = 8;
        grid.render(griddl.specDataRepository.getLastNames());

        grid.page(1);
        expect(grid.firstShownIndex).toBe(1);

        grid.page(2);
        expect(grid.firstShownIndex).toBe(9);

        grid.page(10);
        expect(grid.firstShownIndex).toBe(73);

        grid.settings.perPage = 17;
        grid.page(2);
        expect(grid.firstShownIndex).toBe(18);

        grid.page(6);
        expect(grid.firstShownIndex).toBe(86);
    });
    
    it('should set the currentPage', function () {
        grid.settings.perPage = 3;
        grid.render(griddl.specDataRepository.getPeople());

        grid.page(1);
        expect(grid.currentPage).toBe(1);

        grid.page(3);
        expect(grid.currentPage).toBe(3);
    });

    it('should always output the number of rows specified in perPage', function () {
        grid.settings.perPage = 3;
        grid.render(griddl.specDataRepository.getCompanies());  //5 rows

        expect(container.find('tbody tr').length).toBe(3);

        grid.page(2);
        expect(container.find('tbody tr').length).toBe(3); // 2 with data one empty
    });

    it('should create empty rows on the last page when not enough data to fill grid based on perPage setting', function () {
        grid.render(griddl.specDataRepository.getCompanies());  //5 rows 10 per page default
        expect(container.find('tbody tr.gdl-row-empty').length).toBe(5);
    });

    it('should add a special class to the first empty row so it can be specifically styled', function () {
        var rows, first;

        grid.render(griddl.specDataRepository.getCompanies());  //5 rows 10 per page default
        rows = container.find('tbody tr.gdl-row-empty');
        first = rows.eq(0);

        expect(first.hasClass('gdl-first')).toBeTrue();
    });

    it('should add a special class to the rows when selectable rows are set', function () {
        grid.settings.selectableRows = true;
        grid.render(griddl.specDataRepository.getCompanies());
        
        expect(container.find('tbody tr.gdl-row-selectable').length).toBe(5);
    });

    it('should add a special class to the rows when selectable rows are set and the key field is set', function () {
        grid.settings.selectableRows = true;
        grid.settings.keyField = 'id';
        grid.render(griddl.specDataRepository.getCompanies());

        expect(container.find('tbody tr.gdl-row-selectable').length).toBe(5);
    });

    it('should add the specified key field to the row as a data attribute when selectable rows is on ', function () {
        var rows, i;
        var data = griddl.specDataRepository.getCompanies();

        grid.settings.selectableRows = true;
        grid.settings.keyField = 'id';
        grid.render(data);

        rows = container.find('tbody tr.gdl-row-selectable');

        for (i = 0; i < rows.length; i++) {
            expect(rows[i].getAttribute('data-gdl-key')).toEqual(data[i].id.toString());
        }
    });

    it('should create a cell for every column of data', function () {
        var rows;

        grid.render(griddl.specDataRepository.getCompanies()); // 5 columns; id, company. phone, state, isPublic
        rows = container.find('tbody tr');

        expect(rows.first().find('td').length).toBe(5);
    });

    it('should create a class for each cell specifying its column number', function () {
        var cells, i;

        grid.render(griddl.specDataRepository.getCompanies()); // 4 columns; id, company. phone, state, isPublic
        cells = container.find('tbody tr').first().find('td');

        for (i = 0; i < cells.length; i++) {
            expect(cells.eq(i).hasClass('gdl-col-' + i)).toBeTrue();
        }
    });

    it('should output the data into the cell', function () {
        var rows, cells, i;
        var companies = griddl.specDataRepository.getCompanies();

        grid.settings.perPage = 5;
        grid.render(companies);
        rows = container.find('tbody tr');

        for (i = 0; i < rows.length; i++) {
            cells = rows.eq(i).find('td');

            expect(cells.eq(0).text()).toBe(companies[i].id.toString());
            expect(cells.eq(1).text()).toBe(companies[i].company);
            expect(cells.eq(2).text()).toBe(companies[i].phone);
            expect(cells.eq(3).text()).toBe(companies[i].state);
        }
    });
    
    it('should output a bool using the boolean formatter not output true/false', function () {
        var rows;
        var companies = griddl.specDataRepository.getCompanies();

        grid.generateColumns(['isPublic']);
        grid.settings.columns[0].sorter = griddl.sortType.BOOL;
        grid.render(companies);
        rows = container.find('tbody tr');
        
        expect(rows.eq(0).find('td').text()).toBe('Yes');
        expect(rows.eq(1).find('td').text()).toBe('No');
    });

    it('should use a formatter for the column if one is specified', function () {
        var row;
        var companies = griddl.specDataRepository.getCompanies();

        grid.generateColumns(['company']);
        grid.settings.columns[0].formatter = function () {
            return 'custom';
        };
        grid.render(companies);

        row = container.find('tbody tr').first();
        expect(row.find('td').first().text()).toBe('custom');
    });

    it('should place the rows from the page call inside the body of the griddl grid', function () {
        grid.render(griddl.specDataRepository.getCompanies());

        expect(container.find('.gdl-table').length).toBe(1);
        expect(container.find('.gdl-table > tbody').length).toBe(1);
        expect(container.find('.gdl-table > tbody tr').length).toBe(10);
    });

    it('should set the displayInfo property', function () {
        expect(grid.displayInfo).toBeEmptyString();
        grid.settings.perPage = 5;
        grid.render(griddl.specDataRepository.getPeople());

        expect(grid.displayInfo).toBe('1 - 5 of 10');

        grid.page(2);
        expect(grid.displayInfo).toBe('6 - 10 of 10');
    });

    it('should show the displayInfo in the footer when showFooter is on and showPageInfo is on', function () {
        grid.render(griddl.specDataRepository.getCompanies());

        expect(container.find('.gdl-panel-info').text()).toBeNonEmptyString();
    });
    
    it('should not show the displayInfo in the footer when showFooter is on and showPageInfo is off', function () {
        grid.settings.showPageInfo = false;
        grid.render(griddl.specDataRepository.getCompanies());

        expect(container.find('.gdl-panel-info').text()).toBeEmptyString();
    });

    it('should show the pager in the footer when showFooter is on and showPager is on', function () {
        grid.render(griddl.specDataRepository.getCompanies());

        expect(container.find('.gdl-pager').html()).toBeNonEmptyString();
    });

    it('should not show the pager in the footer when showFooter is on and showPager is off', function () {
        grid.settings.showPager = false;
        grid.render(griddl.specDataRepository.getCompanies());

        expect(container.find('.gdl-panel-pager').html()).toBeEmptyString();
    });
});
