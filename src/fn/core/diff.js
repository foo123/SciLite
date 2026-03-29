function diff(x, dim)
{
    x = vec(x);
    if (is_vector(x))
    {
        return 1 < x.length ? array(x.length-1, function(i) {
            return scalar_sub(x[i+1], x[i]);
        }) : [];
    }
    else if (is_2d(x))
    {
        var sizex = size(x), view = tensorview(x, {shape:sizex, ndarray:sizex}), aux = {};
        ndarray.indices(sizex.filter(function(_, di) {return dim !== di+1;}), function(i) {
            var dj = 0;
            aux[i.join(',')] = diff(view.slice(array(sizex.length, function(di) {
                return dim === di+1 ? ':' : (i[dj++]);
            })).toArray());
        });
        return squeeze(ndarray(sizex.map(function(sz, di) {return dim === di+1 ? sz-1 : sz;}), function(i) {
            return aux[i.slice(0, dim-1).concat(i.slice(dim)).join(',')][i[dim-1]];
        }));
    }
    not_supported("diff");
}
fn.diff = function(x, n, dim) {
    if (null == n) n = 1;
    if (!is_int(n)) not_supported("diff");
    n = _(n);
    var sizex = size(x);
    if (null == dim)
    {
        dim = 2 === sizex.length ? 1 : (sizex.reduce(function(dim, sz, di) {
            if ((null == dim) && (1 < sz)) dim = di;
            return dim;
        }, null) || 0) + 1;
    }
    dim = _(dim);
    while (0 < n--) x = diff(x, dim);
    return x;
};
