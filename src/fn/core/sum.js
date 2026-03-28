function sum(x, dim)
{
    return group_apply(function(sum, xi) {
        return scalar_add(sum, xi);
    }, O, nan, vec(x), "all" === dim ? "all" : (null == dim ? [1] : vec(dim)));
}
fn.sum = sum;
