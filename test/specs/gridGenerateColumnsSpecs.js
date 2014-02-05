describe('grid generate columns suite', function () {
    var grid;
    var baseData= griddl.specDataRepository.getCompanies();

    beforeEach(function () {
        grid = new griddl.Grid('selector');
    });

    it('should generate columns automatically based on the passed data', function () {
        grid.render(baseData);
        expect(grid.settings.columns.length).toBe(5);
    });

    it('should allow you to auto-generate only the columns you want based on their name', function () {
        grid.generateColumns(['company', 'state']);
        expect(grid.settings.columns.length).toBe(2);
    });

    it('should create column heading from the field name with the first letter capitalized', function () {
        grid.data = griddl.specDataRepository.getCompanies();
        grid.generateColumns();
        expect(grid.settings.columns[0].displayName).toBe('Id');
        expect(grid.settings.columns[1].displayName).toBe('Company');
        expect(grid.settings.columns[2].displayName).toBe('Phone');
    });
});
