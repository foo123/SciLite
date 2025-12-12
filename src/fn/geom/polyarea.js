function polyarea(x, y)
{
    // adapted from https://github.com/foo123/Geometrize
    var two=__(2), x1, y1, x2, y2, area = O,
        i, n = stdMath.min(x.length, y.length)-1;
    for (i=0; i<n; ++i)
    {
        x1 = x[i];
        x2 = x[i+1];
        y1 = y[i];
        y2 = y[i+1];
        // shoelace formula
        area = n_add(area, n_div(n_sub(n_mul(x1, y2), n_mul(y1, x2)), two));
    }
    if (1 < n)
    {
        x1 = x[n];
        x2 = x[0];
        y1 = y[n];
        y2 = y[0];
        // shoelace formula
        area = n_add(area, n_div(n_sub(n_mul(x1, y2), n_mul(y1, x2)), two));
    }
    return area;
}
fn.polyarea = function(x, y) {
    x = vec(x);
    y = vec(y);
    if (is_matrix(x) && is_matrix(y))
    {
        if ((ROWS(x) !== ROWS(y)) || (COLS(x) !== COLS(y))) not_supported("polyarea");
        return array(COLS(x), function(column) {
            return polyarea(COL(x, column), COL(y, column));
        });
    }
    if (is_vector(x) && is_vector(y))
    {
        if (x.length !== y.length) not_supported("polyarea");
        return polyarea(x, y);
    }
    not_supported("polyarea");
};
