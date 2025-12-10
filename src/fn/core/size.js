function size(x)
{
    var dims = [].slice.call(arguments, 1);
    if (is_array(dims[0])) dims = dims[0];
    if (is_0d(x))
    {
        return dims.length ? dims.map(function(dim) {return ([1, 1])[_(dim)-1];}) : [1, 1];
    }
    else if (is_1d(x))
    {
        return dims.length ? dims.map(function(dim) {return ([1, x.length])[_(dim)-1];}) : [1, x.length];
    }
    else if (is_2d(x))
    {
        return dims.length ? dims.map(function(dim) {return ([ROWS(x), COLS(x)])[_(dim)-1];}) : [ROWS(x), COLS(x)];
    }
    return [];
}
fn.size = size;
