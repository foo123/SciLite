function repelem(x, n)
{
    if (is_array(x))
    {
        if (is_array(x[0]))
        {
            // higher-dim array
            var sz = size(x), rn = [].slice.call(arguments, 1).map(_);
            if (sz.length === rn.length)
            {
                return ndarray(sz.map(function(di, i) {return di*rn[i];}), function(indices) {
                    return indices.reduce(function(arr, index, dim) {return arr[stdMath.floor(index / rn[dim])];}, x);
                });
            }
        }
        else
        {
            // 1-dim array
            if (is_vector(n))
            {
                if (n.length === x.length)
                {
                    var cnt = 0, i = -1;
                    return array(_(sum(n)), function(j) {
                        if (j === cnt) {++i; cnt += _(n[i]);}
                        return x[i];
                    });
                }
            }
            else if (is_int(n))
            {
                n = _(n);
                var i = -1;
                return array(n*x.length, function(j) {
                    if (0 === (j % n)) ++i;
                    return x[i];
                });
            }
        }
    }
    return x;
}
fn.repelem = repelem;
