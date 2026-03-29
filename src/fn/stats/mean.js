function mean(x, dim)
{
    return group_apply("block", function(x) {
        return x.length ? scalar_div(sum(x), __(x.length)) : nan;
    }, O, nan, vec(x), vec(dim));
}
fn.mean = mean;
