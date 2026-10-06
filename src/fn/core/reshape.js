function reshape(x/*sz, rows, cols*/)
{
    var sz = [].slice.call(arguments, 1), rem,
        sizex = size(x), total = _(prod(sizex));

    if ((1 === sz.length) && is_array(sz[0]) && sz[0].length) sz = vec(sz[0]);

    rem = sz.reduce(function(total, s) {
        return is_array(s) && !s.length ? total : stdMath.floor(total / _(s));
    }, total);

    sz = sz.map(function(s) {
        return is_array(s) && !s.length ? rem : _(s);
    });
    function ret(o)
    {
        return x.$scilitecell$ ? cellarray(o.toNDArray(), o.shape()) : (o.toNDArray());
    }

    // use octave-compatible columnwise-ordering by permuting back and forth
    //return ret(tensorview(tensorview(x, {shape:sizex,ndarray:sizex}).permute(array(sizex.length, function(i) {return sizex.length-1-i;})).toArray(), {shape:sz.reverse()}).permute(array(sz.length, function(i) {return sz.length-1-i;})));
    return ret(tensorview(x, {shape:sizex,ndarray:sizex}).permute(array(sizex.length, function(i) {return sizex.length-1-i;})).reshape(sz.reverse()).permute(array(sz.length, function(i) {return sz.length-1-i;})));

    /*if (is_vector(rows))
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
    }*/
}
fn.reshape = reshape;
