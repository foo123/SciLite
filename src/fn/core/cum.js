function cum(x, f, dir, dim)
{
    if (null == dir) dir = "forward";
    return group_apply("series", function(accum, xi) {
        return null == accum ? xi : f(accum, xi);
    }, null, false, vec(x), vec(dim), dir);
}
fn.cumsum = function(x, dim, dir) {
    var ans = cum(x, scalar_add, dir, dim);
    if (false === ans) not_supported("cumsum");
    return ans;
};
fn.cumprod = function(x, dim, dir) {
    var ans = cum(x, scalar_mul, dir, dim);
    if (false === ans) not_supported("cumprod");
    return ans;
};
fn.cummin = function(x, dim, dir) {
    var cmp = is_real(x) ? cmp_real : cmp_abs,
        ans = cum(x, function(a, b) {return -1 === cmp(a, b) ? a : b;}, dir, dim);
    if (false === ans) not_supported("cummin");
    return ans;
};
fn.cummax = function(x, dim, dir) {
    var cmp = is_real(x) ? cmp_real : cmp_abs,
        ans = cum(x, function(a, b) {return 1 === cmp(a, b) ? a : b;}, dir, dim);
    if (false === ans) not_supported("cummax");
    return ans;
};
