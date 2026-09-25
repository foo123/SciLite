function transpose(x)
{
    var ans;
    if (is_2d(x))
    {
        ans = matrix(COLS(x), ROWS(x), function(i, j) {
            return x[j][i];
        });
        if (x.$scilitecell$) ans = cellarray(ans, [x.$scilitecell$[1], x.$scilitecell$[0]].concat(x.$scilitecell$.slice(2)));
        return ans;
    }
    return x;
}
fn.transpose = function(x) {
    if (is_1d(x)) x = vec2row(x);
    return transpose(x);
};
function ctranspose(x)
{
    var ans;
    if (is_2d(x))
    {
        ans = matrix(COLS(x), ROWS(x), function(i, j) {
            return is_scalar(x[j][i]) ? scalar_conj(x[j][i]) : x[j][i];
        });
        if (x.$scilitecell$) ans = cellarray(ans, [x.$scilitecell$[1], x.$scilitecell$[0]].concat(x.$scilitecell$.slice(2)));
        return ans;
    }
    else if (is_1d(x))
    {
        ans = x.map(function(xi) {
            return is_scalar(xi) ? scalar_conj(xi) : xi;
        });
        if (x.$scilitecell$) ans = cellarray(ans, x.$scilitecell$.slice());
        return ans;
    }
    else if (is_scalar(x))
    {
        return scalar_conj(x);
    }
    return x;
}
fn.ctranspose = function(x) {
    if (is_1d(x)) x = vec2row(x);
    return ctranspose(x);
};
