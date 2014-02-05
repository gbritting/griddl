describe('griddl constructor suite', function () {
    describe('default value suite', function () {
        var grid = new griddl.Grid('');

        it('should default displayInfo to an empty string', function () {
            expect(grid.displayInfo).toBeEmptyString();
        });

        it('should default firstShownIndex to 0', function () {
            expect(grid.firstShownIndex).toBe(0);
        });

        it('should default rowCount to 0', function () {
            expect(grid.rowCount).toBe(0);
        });

        it('should default currentPage to 0', function () {
            expect(grid.currentPage).toBe(0);
        });

        it('should default data to an empty array', function () {
            expect(grid.data).toBeEmptyArray();
        });

        it('should default _originalData to an empty array', function () {
            expect(grid._originalData).toBeEmptyArray();
        });
    });

    describe('containerSelector suite', function () {
        var gridContainer = $('<div class="my-grid"></div><div class="other"></div>');
        $('body').append(gridContainer);
        var grid = new griddl.Grid('.my-grid');

        it('should expose the container selector parameter', function () {
            expect(grid.containerSelector).toBeDefined();
        });

        it('should not mutate the container', function () {
            var container = grid.getContainer();
            grid.containerSelector = '.other';

            expect(container.is(grid.getContainer())).toBeTrue();
        });
    });

    describe('settings suite', function () {
        var grid = new griddl.Grid('');
        var settings = grid.settings;

        describe('default settings values suite', function () {
            it('should default keyField to an empty string', function () {
                expect(settings.keyField).toBeEmptyString();
            });

            it('should default selectableRows to false', function () {
                expect(settings.selectableRows).toBeFalse();
            });

            it('should default perPage to 10', function () {
                expect(settings.perPage).toBe(10);
            });

            it('should default columns to an empty array', function () {
                expect(settings.columns).toBeEmptyArray();
            });

            it('should default showFooter to true', function () {
                expect(settings.showFooter).toBeTrue();
            });

            it('should default showPageInfo to true', function () {
                expect(settings.showPageInfo).toBeTrue();
            });

            it('should default showPerPage to true', function () {
                expect(settings.showPerPage).toBeTrue();
            });

            it('should default showPager to true', function () {
                expect(settings.showPager).toBeTrue();
            });

            it('should provide a default implementation of searcher', function () {
                expect(settings.searcher).toBeFunction();
            });

            it('should return false for the default implementation of searcher', function () {
                expect(settings.searcher({}, 'nothing')).toBeFalse();
            });

            it('should provide a default implementation of onSort', function () {
                expect(settings.onSort).toBeFunction();
            });

            it('should provide a default implementation of OnRowSelect', function () {
                expect(settings.onRowSelect).toBeFunction();
            });

            it('should provide a default implementation of onPerPageChange', function () {
                expect(settings.onPerPageChange).toBeFunction();
            });

            it('should provide a default implementation of onPagerPage', function () {
                expect(settings.onPagerPage).toBeFunction();
            });

            it('should provide a default implementation of onInit', function () {
                expect(settings.onInit).toBeFunction();
            });
        });

        describe('over-ride settings suite', function () {
            //TODO
        });
    });
});