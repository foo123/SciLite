function max(x, y, dim, ComparisonMethod, method)
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
    return group_apply(function(max, xi) {
        return -1 === cmp(max, xi) ? xi : max;
    }, -inf, nan, vec(x), "all" === dim ? "all" : (null == dim ? [1] : vec(dim)));
}
fn.max = max;
