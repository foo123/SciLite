function isequal(a, b, with_nan)
{
    if (is_string(a) && is_string(b))
    {
        return a === b ? 1 : 0;
    }
    else if (is_nan(a) && is_nan(b))
    {
        return with_nan ? 1 : 0;
    }
    else if (is_scalar(a) && is_scalar(b))
    {
        return eq(a, b) ? 1 : 0;
    }
    else if (is_array(a) && is_array(b))
    {
        if (a.length !== b.length) return 0;
        for (var i=0,n=a.length; i<n; ++i)
        {
            if (!isequal(a[i], b[i], with_nan)) return 0;
        }
        return 1;
    }
    return 0;
}
fn.isequal = function(/*args*/) {
    var n = arguments.length, i = 0, ans = 1;
    if (1 < n)
    {
        ans = isequal(arguments[0], arguments[1], false);
        i = 2;
    }
    while (ans && (i < n))
    {
        ans = isequal(arguments[0], arguments[i++], false);
    }
    return ans;
};
fn.isequaln = function(/*args*/) {
    var n = arguments.length, i = 0, ans = 1;
    if (1 < n)
    {
        ans = isequal(arguments[0], arguments[1], true);
        i = 2;
    }
    while (ans && (i < n))
    {
        ans = isequal(arguments[0], arguments[i++], true);
    }
    return ans;
};