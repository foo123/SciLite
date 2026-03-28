function prod(x, dim)
{
    return group_apply(function(prod, xi) {
        return scalar_mul(prod, xi);
    }, I, nan, vec(x), "all" === dim ? "all" : (null == dim ? [1] : vec(dim)));
}
fn.prod = prod;
