function nd_size(x)
{
    return is_array(x) ? ([x.length]).concat(nd_size(x[0])) : [];
}
function size(x)
{
    var dims = [].slice.call(arguments, 1), sizex;
    if (is_array(dims[0])) dims = vec(dims[0]);
    if (is_2d(x))
    {
        // 2d or ndarray
        sizex = nd_size(x);
    }
    else if (is_1d(x))
    {
        // vector
        sizex = x.length ? [1, x.length] : [0, 0];
    }
    else
    {
        // scalar
        sizex = [1, 1];
    }
    return dims.length ? dims.map(function(dim) {return sizex[_(dim)-1];}) : sizex;
    //return [];
}
fn.size = function(x) {
    return varargout(size.apply(null, [].slice.call(arguments)));
};
