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
        else if (is_vector(x) && (x.length === y.length))
        {
            for (i=0,n=x.length-1,ans=O; i<n; ++i)
            {
                ans = scalar_add(ans, scalar_mul(scalar_abs(scalar_sub(x[i+1], x[i])), scalar_div(scalar_add(y[i+1], y[i]), two)));
            }
            return ans;
        }
    }
    else if (is_matrix(y))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            if ((null == x) || is_scalar(x) || (is_vector(x) && (x.length === ROWS(y))))
            {
                return array(COLS(y), function(column) {
                    return trapz(x, COL(y, column));
                });
            }
            else if (is_matrix(x) && (ROWS(x) === ROWS(y)) && (COLS(x) === COLS(y)))
            {
                return array(COLS(y), function(column) {
                    return trapz(null == x ? null : COL(x, column), COL(y, column));
                });
            }
        }
        else if (2 === dim)
        {
            if ((null == x) || is_scalar(x) || (is_vector(x) && (x.length === COLS(y))))
            {
                return array(ROWS(x), function(row) {
                    return trapz(x, ROW(y, row));
                });
            }
            else if (is_matrix(x) && (ROWS(x) === ROWS(y)) && (COLS(x) === COLS(y)))
            {
                return array(ROWS(x), function(row) {
                    return trapz(ROW(x, row), ROW(y, row));
                });
            }
        }
    }
    not_supported("trapz");
}
fn.trapz = function(x, y, dim) {
    if (3 > arguments.length)
    {
        if (is_array(y))
        {
            dim = 1;
        }
        else if (is_array(x) && !is_array(y))
        {
            dim = y;
            y = x;
            x = null;
        }
    }
    return trapz(is_array(x) ? vec(x) : x, vec(y), dim);
};
function cumtrapz(x, y, dim)
{
    if (is_scalar(y))
    {
        return y;
    }
    else if (is_vector(y))
    {
        if ((null == x) || is_scalar(x))
        {
            return y.map(function(yi, i) {
                return trapz(x, y.slice(0, i+1));
            });
        }
        else if (is_vector(x) && (x.length === y.length))
        {
            return y.map(function(yi, i) {
                return trapz(x.slice(0, i+1), y.slice(0, i+1));
            });
        }
    }
    else if (is_matrix(y))
    {
        if (null == dim) dim = 1;
        dim = _(dim);
        if (1 === dim)
        {
            if ((null == x) || is_scalar(x) || (is_vector(x) && (x.length === ROWS(y))))
            {
                return array(COLS(y), function(column) {
                    return cumtrapz(x, COL(y, column), dim);
                });
            }
            else if (is_matrix(x) && (ROWS(x) === ROWS(y)) && (COLS(x) === COLS(y)))
            {
                return array(COLS(y), function(column) {
                    return cumtrapz(COL(x, column), COL(y, column), dim);
                });
            }

        }
        else if (2 === dim)
        {
            if ((null == x) || is_scalar(x) || (is_vector(x) && (x.length === COLS(y))))
            {
                return array(ROWS(y), function(row) {
                    return cumtrapz(x, ROW(y, row), dim);
                });
            }
            else if (is_matrix(x) && (ROWS(x) === ROWS(y)) && (COLS(x) === COLS(y)))
            {
                return array(ROWS(y), function(row) {
                    return cumtrapz(ROW(x, row), ROW(y, row), dim);
                });
            }
        }
    }
    not_supported("cumtrapz");
}
fn.cumtrapz = function(x, y, dim) {
    if (3 > arguments.length)
    {
        if (is_array(y))
        {
            dim = 1;
        }
        else if (is_array(x) && !is_array(y))
        {
            dim = y;
            y = x;
            x = null;
        }
    }
    return cumtrapz(is_array(x) ? vec(x) : x, vec(y), dim);
};
