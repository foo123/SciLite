function std(x, w, dim)
{
    w = _(w || 0);
    return group_apply(function(x) {
        return 0 === x.length ? nan : (1 === x.length ? O : realMath.sqrt(scalar_div(sum(dotpow(abs(sub(x, mean(x))), __(2))), __(1 === w ? x.length : (x.length-1)))));
    }, O, nan, vec(x), vec(dim), "block");
}
fn.std = std;
