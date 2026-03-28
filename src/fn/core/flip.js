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
        dim = _(dim);
        var sizex = size(x),
            view = tensorview(x, {shape:sizex, ndarray:sizex});
        return view.slice(sizex.map(function(sz, di) {
            if (null == dim)
            {
                if (1 !== sz)
                {
                    dim = di+1;
                    return '-1:-1:0';
                }
                return ':';
            }
            return di+1 === dim ? '-1:-1:0' : ':';
        })).toNDArray();
        /*var rows = ROWS(x), cols = COLS(x);
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
        return x;*/
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
