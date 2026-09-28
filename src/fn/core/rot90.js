function rot90(x, k)
{
    if (is_2d(x))
    {
        var sizex, order, rows, cols, view,
            ret = x.$scilitecell$ ? function(o) {
                return cellarray(o.toNDArray(), o.shape());
            } : function(o) {
                return o.toNDArray();
            };
        if (null == k) k = 1;
        k = stdMath.round(_(k)) % 4;
        if (0 > k) k += 4;
        if (is_nd(x))
        {
            // nd array
            sizex = size(x);
            rows = sizex[0];
            cols = sizex[1];
            view = tensorview(x, {shape:sizex, ndarray:sizex});
            if (1 === k)
            {
                order = [1, 0].concat(array(sizex.length-2, function(i) {return 2+i;}));
                return ret(view.permute(order).slice(order.map(function(oi) {return 1 === oi ? '-1:-1:0' : ':';})));
            }
            else if (3 === k)
            {
                order = [1, 0].concat(array(sizex.length-2, function(i) {return 2+i;}));
                return ret(view.permute(order).slice(order.map(function(oi) {return 0 === oi ? '-1:-1:0' : ':';})));
            }
            else if (2 === k)
            {
                order = array(sizex.length, function(i) {return i;});
                return ret(view.slice(order.map(function(oi) {return 0 === oi || 1 === oi ? '-1:-1:0' : ':';})));
            }
        }
        else
        {
            rows = ROWS(x);
            cols = COLS(x);
            if (1 === k)
            {
                return ret(matrix(cols, rows, function(j, i) {return x[i][cols-1-j];}));
            }
            else if (3 === k)
            {
                return ret(matrix(cols, rows, function(j, i) {return x[rows-1-i][j];}));
            }
            else if (2 === k)
            {
                return ret(matrix(rows, cols, function(i, j) {return x[rows-1-i][cols-1-j];}));
            }
        }
    }
    return x;
}
fn.rot90 = function(x, k) {
    if (is_1d(x)) x = vec2row(x);
    return rot90(x, k);
};
