function pascal(n)
{
    // adapted from https://github.com/foo123/FILTER.js
    return matrix(n, n, function(i, j, mat) {
        return 0 === i ? 1 : (0 === j ? 1 : (mat[i-1][j]+mat[i][j-1]));
    });
}
fn.pascal = function(n) {
    if (1 < arguments.length) not_supported("pascal");
    n = sca(n, true);
    n = is_int(n) ? _(n) : null;
    if (!is_int(n) || (0 >= n)) return [];
    var p = pascal(n);
    return matrix(n, n, function(i, j) {return __(p[i][j]);});
};
