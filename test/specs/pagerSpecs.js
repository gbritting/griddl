describe('page suite', function () {
    it('should calculate the max page based on the number of items and the number of items per page', function () {
        expect(griddl.pager.calcMaxPage(10, 10)).toBe(1);
        expect(griddl.pager.calcMaxPage(10, 5)).toBe(2);
        expect(griddl.pager.calcMaxPage(11, 3)).toBe(4);
        expect(griddl.pager.calcMaxPage(1, 10)).toBe(1);
        expect(griddl.pager.calcMaxPage(0, 10)).toBe(0);
    });

    describe('pager reset suite', function () {
        var pager;

        $('body').append('<div class="griddl-pager-reset-test"></div>');
        $('.griddl-pager-reset-test').append(griddl.pager.shell);
        pager = $('.griddl-pager-reset-test').find('.gdl-pager');

        it('should not enable any buttons when the number of records is less than or equal to the items per page', function () {
            griddl.pager.reset(pager, 1, 10, 10);
            expect(pager.find('li.gdl-button-enabled').length).toBe(0);
        });

        it('should not enable the first button and prev button when on the first page', function () {
            var enabledButtons;

            griddl.pager.reset(pager, 1, 10, 1);
            enabledButtons = pager.find('li.gdl-button-enabled');

            expect(enabledButtons.eq(0).text()).toBe('Next');
            expect(enabledButtons.eq(1).text()).toBe('Last');
        });

        it('should not enable the next button and the last button when on the last page', function () {
            var enabledButtons;

            griddl.pager.reset(pager, 10, 10, 1);
            enabledButtons = pager.find('li.gdl-button-enabled');

            expect(enabledButtons.eq(0).text()).toBe('First');
            expect(enabledButtons.eq(1).text()).toBe('Prev');
        });

        it('should enable all buttons when not on either the first or the last page', function () {
            griddl.pager.reset(pager, 3, 10, 1);
            expect(pager.find('li.gdl-button-enabled').length).toBe(4);
        });
        
        it('should set the data number attribute to the previous and next page numbers', function () {
            var pagerButtons = pager.find('li');
            var prevButton = pagerButtons.eq(1);
            var nextButton = pagerButtons.eq(2);

            griddl.pager.reset(pager, 1, 10, 10);
            expect(prevButton.attr('data-number')).toBe('0');
            expect(nextButton.attr('data-number')).toBe('2');

            griddl.pager.reset(pager, 10, 10, 1);
            expect(prevButton.attr('data-number')).toBe('9');
            expect(nextButton.attr('data-number')).toBe('11');
        });
    });
});
