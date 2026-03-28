function min(x, y, dim, ComparisonMethod, method)
{
    if ("ComparisonMethod" === ComparisonMethod)
    {
        if (("real" !== method) && ("abs" !== method)) method = "auto";
    }
    else
    {
        method = "auto";
    }
    //y = vec(y); // not supported yet
    var cmp = "auto" === method ? (is_real(x) ? cmp_real : cmp_abs) : ("abs" === method ? cmp_abs : cmp_real);
    return group_apply(function(min, xi) {
        return -1 === cmp(xi, min) ? xi : min;
    }, inf, nan, vec(x), "all" === dim ? "all" : (null == dim ? [1] : vec(dim)));
}
fn.min = min;
