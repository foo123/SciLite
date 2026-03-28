function sum(x, dim)
{
    return group_apply(function(sum, xi) {
        return scalar_add(sum, xi);
    }, O, nan, vec(x), vec(dim));
}
fn.sum = sum;
