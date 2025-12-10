function reshape(x, rows, cols)
{
    if (is_vector(rows))
    {
        cols = rows[1];
        rows = rows[0];
    }
    rows = _(rows); cols = _(cols);
    var n = rows*cols;
    if (is_0d(x) && (1 === rows) && (1 === cols))
    {
        return [[x]];
    }
    else if (is_1d(x) && (x.length === n))
    {
        return matrix(rows, cols, function(i, j) {
            return x[i + rows*j];
        });
    }
    else if (is_2d(x) && (ROWS(x)*COLS(x) === n))
    {
        var xrows = ROWS(x);
        return matrix(rows, cols, function(i, j) {
            var index = i + rows*j;
            return x[index % xrows][stdMath.floor(index/xrows)];
        });
    }
    else
    {
        return x;
    }
}
fn.reshape = reshape;
