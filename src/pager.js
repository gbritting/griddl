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
