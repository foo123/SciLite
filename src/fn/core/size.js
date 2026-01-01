function size(x)
{
    var dims = [].slice.call(arguments, 1), sizeofx;
    if (is_array(dims[0])) dims = vec(dims[0]);
    if (is_0d(x))
    {
        sizeofx = [1, 1];
        return dims.length ? dims.map(function(dim) {return sizeofx[_(dim)-1];}) : sizeofx;
    }
    else if (is_1d(x))
    {
        sizeofx = [1, x.length];
        return dims.length ? dims.map(function(dim) {return sizeofx[_(dim)-1];}) : sizeofx;
    }
    else if (is_nd(x))
    {
        sizeofx = [x.length].concat(size(x[0]));
        return dims.length ? dims.map(function(dim) {return sizeofx[_(dim)-1];}) : sizeofx;
    }
    else if (is_2d(x))
    {
        sizeofx = [ROWS(x), COLS(x)];
        return dims.length ? dims.map(function(dim) {return sizeofx[_(dim)-1];}) : sizeofx;
    }
    return [];
}
fn.size = function(x) {
    return varargout(size.apply(null, [].slice.call(arguments)));
};
