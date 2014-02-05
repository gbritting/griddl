describe('perPage suite', function () {
    it('should be created with default options of 10, 20 and 50', function () {
        var perPageSelect = $(griddl.perPage.build(10));
        var options = perPageSelect.find('option');

        expect(options.length).toBe(3);
        expect(options.eq(0).text()).toBe('10');
        expect(options.eq(1).text()).toBe('20');
        expect(options.eq(2).text()).toBe('50');
    });

    it('should create an option value the same as the text', function () {
        var perPageSelect = $(griddl.perPage.build(10));

        expect(perPageSelect[0].options[0].value).toBe(perPageSelect[0].options[0].innerText);
        expect(perPageSelect[0].options[1].value).toBe(perPageSelect[0].options[1].innerText);
        expect(perPageSelect[0].options[2].value).toBe(perPageSelect[0].options[2].innerText);
    });

    it('should set the option as selected if the initial value matches', function () {
        var perPageSelect = $(griddl.perPage.build(50));
        var selectedValue = perPageSelect[0].options[perPageSelect[0].selectedIndex].value;

        expect(selectedValue).toBe('50');
    });
});
