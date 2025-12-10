function moment(x, order, dim)
{
    if (is_scalar(x))
    {
        return __(0);
    }
    else if (is_vector(x))
    {
        if (1 >= x.length) return x.length ? __(0) : nan;
        var N = x.length;
        return scalar_div(sum(dotpow(sub(x, mean(x)), order)), __(N));
    }
    else if (is_matrix(x))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            order = __(order);
            return array(COLS(x), function(column) {
                return moment(COL(x, column), order);
            });
        }
        else if (2 === dim)
        {
            order = __(order);
            return array(ROWS(x), function(row) {
                return moment(ROW(x, row), order);
            });
        }
    }
    not_supported("moment");
}
fn.moment = moment;
