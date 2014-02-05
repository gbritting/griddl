/**
 * Object that handles internal sorting
 */
griddl.sorter = {
    sortBy: function(field, reverse, primer) {
        var key = function (x) {return primer ? primer(x[field]) : x[field];};

        return function (a,b) {
            var A = key(a), B = key(b);
            return ( (A < B) ? -1 : ((A > B) ? 1 : 0) ) * [-1,1][+!!reverse];
        };
    },
    byString: function (data, field, sortAscending) {
        data.sort(this.sortBy(field, sortAscending, function(a) {
            if (typeof a !== 'string') {
                return a.toString().toUpperCase();
            }
            return a.toUpperCase();
        }));
    },
    byFloat: function (data, field, sortAscending) {
        data.sort(this.sortBy(field, sortAscending, parseFloat));
    },
    byInt: function (data, field, sortAscending) {
        data.sort(this.sortBy(field, sortAscending, parseInt));
    },
    byDate: function (data, field, sortAscending) {
        data.sort(this.sortBy(field, sortAscending, function(a) { return new Date(a);}));
    }
};
