describe(' grid search suite', function () {
    var grid;
    var strippedSearchString;
    var baseData = griddl.specDataRepository.getPeople();
    var searcher = function (model, searchString) {
        var searchUpper = searchString.toUpperCase();
        strippedSearchString = searchString;

        return model.name.toUpperCase().indexOf(searchUpper) !== -1;
    };

    beforeEach(function () {
        grid = new griddl.Grid('selector', { searcher: searcher});
        grid.render(baseData);
    });

    it('should remove whitespace from the beginning and end of the searchString', function () {
        grid.search(' b ');
        expect(strippedSearchString).toBe('b');
    });

    it('should not set _originalData when no search results found', function () {
        expect(grid._originalData).toBeEmptyArray();

        grid.search('something not in data');
        expect(grid._originalData).toBeEmptyArray();
    });

    it('should set _originalData to empty array when search found results, then subsequent search did not', function () {
        expect(grid._originalData).toBeEmptyArray();

        grid.search('trevino');
        expect(grid._originalData.length).toBe(baseData.length);

        grid.search('something not found');
        expect(grid._originalData).toBeEmptyArray();
    });

    it('should set _originalData to data when search results found', function () {
        expect(grid._originalData).toBeEmptyArray();

        grid.search('trevino');
        expect(grid._originalData).toBeNonEmptyArray();
        expect(grid._originalData.length).toBe(baseData.length);
    });

    it('should search on the initial data if you search a second-time even without clearing', function () {
        expect(grid._originalData).toBeEmptyArray();
        expect(grid.data.length).toBe(10);

        grid.search('trevino');
        expect(grid.data.length).toBe(1);
        expect(grid._originalData.length).toBe(10);

        grid.search('ja');
        expect(grid.data.length).toBe(2);
    });

    it('should set data to the returned search results when search matches', function () {
        expect(grid.data.length).toBe(10);
        grid.search('trevino');
        expect(grid.data.length).toBe(1);
    });

    it('should return the number of rows matching', function () {
        var foundCount = grid.search('trevino');
        expect(foundCount).toBe(1);

        foundCount = grid.search('something not found');
        expect(foundCount).toBe(0);
    });

    it('should return multiple rows when we match more than one model object', function () {
        var foundCount = grid.search('ja');
        expect(foundCount).toBe(2);
        expect(grid.data.length).toBe(2);
    });

    it('should call page(1) to reset the grid when search results are found', function () {
        spyOn(grid, 'page');
        grid.search('ja');
        expect(grid.page).toHaveBeenCalledWith(1);
    });

    it('should not call page when no search results are found', function () {
        spyOn(grid, 'page');
        grid.search('something not found');
        expect(grid.page).not.toHaveBeenCalled();
    });
});

describe('grid clear search suite', function () {
    var grid;
    var baseData = griddl.specDataRepository.getPeople();
    var searcher = function (model, searchString) {
        var searchUpper = searchString.toUpperCase();
        return model.name.toUpperCase().indexOf(searchUpper) !== -1;
    };

    beforeEach(function () {
        grid = new griddl.Grid('selector', { searcher: searcher});
        grid.render(baseData);
    });

    it('should reset data but only when _originalData exists', function () {
        grid.search('Wiley');
        expect(grid._originalData.length).toBe(10);
        expect(grid.data.length).toBe(1);

        grid.clearSearch();
        expect(grid._originalData).toBeEmptyArray();
    });

    it('should not reset data if _original data does not exist', function () {
        var gridDataLength = grid.data.length;
        expect(grid.data).toBeNonEmptyArray();
        expect(grid._originalData).toBeEmptyArray();

        grid.clearSearch();
        expect(grid.data.length).toBe(gridDataLength);
    });

    it('should reset the grid to the first page', function () {
        spyOn(grid, 'page');
        grid.clearSearch();

        expect(grid.page).toHaveBeenCalledWith(1);
    });
});

