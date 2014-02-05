describe('formatter suite', function () {
    it('should return "Yes" for a true boolean', function () {
        expect(griddl.formatter.bool(true)).toBe('Yes');
    });

    it('should return "No" for a false boolean', function () {
        expect(griddl.formatter.bool(false)).toBe('No');
    });
});
