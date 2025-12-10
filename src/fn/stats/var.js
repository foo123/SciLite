function variance(x, w, dim)
{
    w = _(w || 0);
    if (is_scalar(x))
    {
        return __(0);
    }
    else if (is_vector(x))
    {
        if (1 >= x.length) return x.length ? __(0) : nan;
        var N = x.length,
            mu_x = mean(x),
            bar_x = sub(x, mu_x);
        return scalar_div(sum(dotmul(conj(bar_x), bar_x)), __(1 === w ? N : (N-1)));
    }
    else if (is_matrix(x))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            return array(COLS(x), function(column) {
                return variance(COL(x, column), w);
            });
        }
        else if (2 === dim)
        {
            return array(ROWS(x), function(row) {
                return variance(ROW(x, row), w);
            });
        }
    }
    not_supported("var");
}
fn['var'] = variance;
