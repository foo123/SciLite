function trapz(x, y, dim)
{
    if (is_vector(y))
    {
        var i, n, ans;
        if ((null == x) || is_scalar(x))
        {
            if (null == x) x = I/*scalar_div(scalar_abs(scalar_sub(y[n], y[0])), n+1)*/;
            for (i=0,n=y.length-1,ans=O; i<n; ++i)
            {
                ans = scalar_add(ans, scalar_mul(x, scalar_div(scalar_add(y[i+1], y[i]), two)));
            }
            return ans;
        }
        else if (is_vector(x))
        {
            if (x.length === y.length)
            {
                for (i=0,n=x.length-1,ans=O; i<n; ++i)
                {
                    ans = scalar_add(ans, scalar_mul(scalar_abs(scalar_sub(x[i+1], x[i])), scalar_div(scalar_add(y[i+1], y[i]), two)));
                }
                return ans;
            }
            throw "trapz: x,y dimensions do not match";
        }
    }
    else if (is_2d(y))
    {
        var sizey = size(y), view = tensorview(y, {shape:sizey, ndarray:sizey}), aux = {};
        if (null == dim)
        {
            dim = 2 === sizey.length ? 1 : (sizey.reduce(function(dim, sz, di) {
                if ((null == dim) && (1 < sz)) dim = di;
                return dim;
            }, null) || 0) + 1;
        }
        dim = _(dim);
        ndarray.indices(sizey.filter(function(_, di) {return dim !== di+1;}), function(i) {
            var dj = 0;
            aux[i.join(',')] = trapz(x, view.slice(array(sizey.length, function(di) {
                return dim === di+1 ? ':' : (i[dj++]);
            })).toArray());
        });
        return squeeze(ndarray(sizey.map(function(sz, di) {return dim === di+1 ? 1 : sz;}), function(i) {
            return aux[i.slice(0, dim-1).concat(i.slice(dim)).join(',')];
        }));
    }
    not_supported("trapz");
}
fn.trapz = function(x, y, dim) {
    if (3 > arguments.length)
    {
        if (is_array(y))
        {
            dim = null;
        }
        else if (is_array(x))
        {
            dim = is_int(y) ? y : null;
            y = x;
            x = null;
        }
    }
    return trapz(is_array(x) ? vec(x) : x, vec(y), dim);
};
function cumtrapz(x, y, dim)
{
    return group_apply("block-series", function(y) {
        if ((null == x) || is_scalar(x))
        {
            return y.map(function(yi, i) {
                return trapz(x, y.slice(0, i+1));
            });
        }
        else if (is_vector(x))
        {
            if (x.length === y.length)
            {
                return y.map(function(yi, i) {
                    return trapz(x.slice(0, i+1), y.slice(0, i+1));
                });
            }
            throw "cumtrapz: x,y dimensions do not match";
        }
    }, null, false, vec(y), dim);
}
fn.cumtrapz = function(x, y, dim) {
    if (3 > arguments.length)
    {
        if (is_array(y))
        {
            dim = null;
        }
        else if (is_array(x))
        {
            dim = is_int(y) ? y : null;
            y = x;
            x = null;
        }
    }
    return cumtrapz(is_array(x) ? vec(x) : x, vec(y), dim);
};
