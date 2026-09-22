function cell(/*args*/)
{
    var args = arguments, dims = [0, 0];
    if (1 === args.length)
    {
        // single dim, or vector of dims passed as arg
        dims = vec(args[0]).map(_);
    }
    else if (1 < args.length)
    {
        // dims passed as args
        dims = [].map.call(args, _);
    }
    if (1 > dims.length) dims = [0, 0];
    else if (2 > dims.length) dims.push(dims[0]);
    return cellarray(ndarray(dims, function() {return [];}), dims);
}
fn.cell = cell;
fn.iscell = function(x) {
    return is_cell(x) ? 1 : 0;
};