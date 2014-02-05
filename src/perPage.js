/**
 * Helper for creating the internal per page select list
 */
griddl.perPage = {
    options: [10, 20, 50],
    build: function (initialValue) {
        var selected;
        var select = '<select>';

        for (var i = 0; i < this.options.length; i++){
            selected = this.options[i] === initialValue ? ' selected="selected"' : '';
            select += '<option value="' + this.options[i] + '"' + selected + '>' + this.options[i] + '</option>';
        }
        return select + '</select> per page';
    }
};
