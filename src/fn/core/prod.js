function prod(x, dim)
{
    return group_apply("value", function(prod, xi) {
        return scalar_mul(prod, xi);
    }, I, nan, vec(x), vec(dim));
}
fn.prod = prod;
