function flip(x, dim)
{
    if (is_0d(x))
    {
        return x;
    }
    else if (is_1d(x))
    {
        return x.slice().reverse();
    }
    else if (is_2d(x))
    {
        var rows = ROWS(x), cols = COLS(x);
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            return matrix(rows, cols, function(row, col) {
                return x[rows-1-row][col];
            });
        }
        else if (2 === dim)
        {
            return matrix(rows, cols, function(row, col) {
                return x[row][cols-1-col];
            });
        }
        return x;
    }
    not_supported("flip");
}
fn.flip = flip;
fn.fliplr = function(x) {
    return flip(x, 2);
};
fn.flipud = function(x) {
    return flip(x, 1);
};
