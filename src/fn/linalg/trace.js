function trace(x)
{
    if (is_scalar(x))
    {
        return x;
    }
    else if (is_matrix(x))
    {
        return x.reduce(function(trace, xi, i) {
            return scalar_add(trace, i < xi.length ? x[i][i] : 0);
        }, 0);
    }
    not_supported("trace");
}
fn.trace = trace;
