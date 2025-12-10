function diff(x, dim)
{
    if (is_vector(x))
    {
        return 1 < x.length ? array(x.length-1, function(i) {
            return scalar_sub(x[i+1], x[i]);
        }) : [];
    }
    else if (is_matrix(x))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            return array(COLS(x), function(column) {
                return diff(COL(x, column));
            });
        }
        else if (2 === dim)
        {
            return array(ROWS(x), function(row) {
                return diff(ROW(x, row));
            });
        }
    }
    not_supported("diff");
}
fn.diff = function(x, n, dim) {
    if (null == dim) dim = 1;
    if (null == n) n = 1;
    if (!is_int(n)) not_supported("diff");
    n = _(n);
    while (0 < n--) x = diff(x, dim);
    return x;
};
