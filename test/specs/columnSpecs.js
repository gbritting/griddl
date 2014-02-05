describe('column suite', function () {
    describe('constructor parameters suite', function () {
        var column = new griddl.Column('field', 'display');

        it('should set the fieldName', function () {
            expect(column.fieldName).toBe('field');
        });

        it('should set the displayName', function () {
            expect(column.displayName).toBe('display');
        });

        it('should set a default width of 0 when width is not passed', function () {
            expect(column.width).toBe(0);
        });

        it('should set the default to sort by string if sorter is not passed', function () {
            expect(column.sorter).toBe(griddl.sortType.STRING);
        });

        it('should set the currentSortOrder to none', function () {
            expect(column.currentSortOrder).toBe(griddl.columnSortOrder.NONE);
        });

        it('should set the width when passed', function () {
            var columnWithWidth = new griddl.Column('field', 'display', 20);
            expect(columnWithWidth.width).toBe(20);
        });
    });

    describe('column prototype suite', function () {
        // getIsSortable
        it('should return true when the sorter isn\'t passed', function () {
            var column = new griddl.Column('', ''); // defaults to sortType.STRING
            expect(column.getIsSortable()).toBeTrue();
        });

        it('should return true when a sorter function is passed', function () {
            var column = new griddl.Column('', '', 20, function () {});
            expect(column.getIsSortable()).toBeTrue();
        });

        it('should return false when a sortType of NO_SORTING is set', function () {
            var column = new griddl.Column('', '', 20, griddl.sortType.NO_SORTING);
            expect(column.getIsSortable()).toBeFalse();
        });

        it('should return true when a proper sortTpe is passed', function () {
            var column = new griddl.Column('', '', 25, griddl.sortType.BOOL);
            expect(column.getIsSortable()).toBeTrue();
        });

        // getIsCurrentlyAscending
        it('should return false if the column is not set to ascending', function () {
            var column = new griddl.Column('', '', 20);
            column.currentSortOrder = griddl.columnSortOrder.DESC;
            expect(column.getIsCurrentlyAscending()).toBeFalse();
        });

        it('should return false if the column is not set to ascending', function () {
            var column = new griddl.Column('', '', 20);
            column.currentSortOrder = griddl.columnSortOrder.ASC;
            expect(column.getIsCurrentlyAscending()).toBeTrue();
        });

        // switchSortOrder
        it('should switch ascending to descending', function () {
            var column = new griddl.Column('', '', 20);
            column.currentSortOrder = griddl.columnSortOrder.ASC;
            column.switchSortOrder();

            expect(column.currentSortOrder).toBe(griddl.columnSortOrder.DESC);
        });

        it('should switch descending to ascending', function () {
            var column = new griddl.Column('', '', 20);
            column.currentSortOrder = griddl.columnSortOrder.DESC;
            column.switchSortOrder();

            expect(column.currentSortOrder).toBe(griddl.columnSortOrder.ASC);
        });

        it('should set the sort order to ascending when sort order is none and switchOrder is called', function () {
            var column = new griddl.Column('', '', 20);
            column.currentSortOrder = griddl.columnSortOrder.NONE;
            column.switchSortOrder();

            expect(column.currentSortOrder).toBe(griddl.columnSortOrder.ASC);
        });
    });
});
