describe('sorter suite', function () {
    describe('int sorter suite', function () {
        var data = [{"intValue": 0}, {"intValue": 1}, {"intValue": 2}];

        it('should sort int descending 9-0', function () {
            griddl.sorter.byInt(data, 'intValue', false);

            expect(data[0].intValue).toBe(2);
            expect(data[2].intValue).toBe(0);
        });

        it('should sort int ascending 0-9', function () {
            griddl.sorter.byInt(data, 'intValue', true);

            expect(data[0].intValue).toBe(0);
            expect(data[2].intValue).toBe(2);
        });
    });

    describe('date sorter suite', function () {
        var data = [
            {"dateValue": new Date(1994, 10, 27)},
            {"dateValue": new Date(2001, 01, 14)},
            {"dateValue": new Date(2123, 12, 31)}
        ];

        it('should sort date ascending', function () {
            griddl.sorter.byDate(data, 'dateValue', true);
            expect(data[0].dateValue).toEqual(new Date(1994, 10, 27));
            expect(data[2].dateValue).toEqual(new Date(2123, 12, 31));
        });

        it('should sort date descending', function () {
            griddl.sorter.byDate(data, 'dateValue', false);
            expect(data[0].dateValue).toEqual(new Date(2123, 12, 31));
            expect(data[2].dateValue).toEqual(new Date(1994, 10, 27));
        });
    });

    describe('float sorter suite', function () {
        var data = [{"floatValue": 5.4}, {"floatValue": 99.45}, {"floatValue": 5654.56456}];

        it('should sort float descending', function () {
            griddl.sorter.byFloat(data, 'floatValue', false);
            expect(data[0].floatValue).toBe(5654.56456);
            expect(data[2].floatValue).toBe(5.4);
        });

        it('should sort float ascending', function () {
            griddl.sorter.byFloat(data, 'floatValue', true);
            expect(data[0].floatValue).toBe(5.4);
            expect(data[2].floatValue).toBe(5654.56456);
        });
    });

    describe('string sorter suite', function () {
        var data = [{"stringValue": "a"}, {"stringValue": "b"}, {"stringValue": "c"}];

        it('should sort descending', function () {
            griddl.sorter.byString(data, 'stringValue', false);
            expect(data[0].stringValue).toBe('c');
            expect(data[2].stringValue).toBe('a');
        });

        it('should sort ascending', function () {
            griddl.sorter.byString(data, 'stringValue', true);
            expect(data[0].stringValue).toBe('a');
            expect(data[2].stringValue).toBe('c');
        });
        
        it('should convert non-string fields to string before trying to convert them', function () {
            var data = [
                {"value": new Date(1994, 10, 27)},
                {"value": 45},
                {"value": 67.82}
            ];

            expect(function (){ griddl.sorter.byString(data, 'value', true); }).not.toThrow();
        });
    });
});
