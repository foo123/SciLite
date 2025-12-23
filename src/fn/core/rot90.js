function rot90(x, k)
{
    if (is_2d(x))
    {
        var rows = ROWS(x), cols = COLS(x);
        if (null == k) k = 1;
        k = stdMath.round(_(k)) % 4;
        if (0 > k) k += 4;
        if (1 === k)
        {
            return matrix(cols, rows, function(j, i) {return x[i][cols-1-j];});
        }
        else if (3 === k)
        {
            return matrix(cols, rows, function(j, i) {return x[rows-1-i][j];});
        }
        else if (2 === k)
        {
            return matrix(rows, cols, function(i, j) {return x[rows-1-i][cols-1-j];});
        }
    }
    return x;
}
fn.rot90 = function(x, k) {
    if (is_1d(x)) x = vec2row(x);
    return rot90(x, k);
};
