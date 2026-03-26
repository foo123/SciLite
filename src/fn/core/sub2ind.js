function _sub2ind(dims, indices)
{
    var array_indices = indices.filter(function(ind) {return is_array(ind);});
    if (array_indices.length)
    {
        return array_indices[0].map(function(_, j) {
            return _sub2ind(dims, indices.map(function(i) {return is_array(i) ? i[j] : i;}));
        });
    }
    else
    {
        // use octave-compatible columnwise-ordering by permuting back and forth
        return tensorview(0, {shape:dims.slice().reverse()}).index(indices.map(function(i) {return _(i)-1;}).reverse())+1;
    }
}
function _ind2sub(dims, ind)
{
    if (is_array(ind))
    {
        var indices = array(dims.length, function() {return array(ind.length, 0);});
        ind.forEach(function(ind, i) {
            _ind2sub(dims, ind).forEach(function(_indices, j) {
                indices[j][i] = _indices;
            });
        });
        return indices;
    }
    else
    {
        // use octave-compatible columnwise-ordering by permuting back and forth
        return 1 === dims.length ? [_(ind), 1] : (tensorview(0, {shape:dims.slice().reverse()}).indices(_(ind)-1).map(function(i) {return i+1;}).reverse());
    }
}
function sub2ind(dims/*, i, j*/)
{
    var indices = [].slice.call(arguments, 1);
    if (1 === indices.length && is_array(indices[0])) indices = indices[0];
    return _sub2ind(vec(dims), indices);

    /*if (is_vector(i))
    {
        j = i[1];
        i = i[0];
    }
    i = _(i); j = _(j);
    return 1 === dims.length ? i : ((i-1)+_(dims[0])*(j-1)+1);*/
}
fn.sub2ind = sub2ind;
function ind2sub(dims, ind)
{
    dims = vec(dims);
    return varargout(_ind2sub(dims, ind));

    /*ind = _(ind);
    return 1 === dims.length ? [ind, 1] : [((ind-1) % _(dims[0])) + 1, stdMath.floor((ind-1) / _(dims[0])) + 1];*/
}
fn.ind2sub = ind2sub;
