function cat(type, A, B)
{
    if (("horz" === type) && is_2d(A) && is_2d(B) && (ROWS(A) === ROWS(B)))
    {
        return A.map(function(Ai, i) {
            return Ai.concat(B[i]);
        });
    }
    if (("vert" === type) && is_2d(A) && is_2d(B) && (COLS(A) === COLS(B)))
    {
        return A.concat(B);
    }
    not_supported("cat");
}
fn.cat = function(dim, A, B /*,..*/) {
    dim = _(dim);
    var ans = [], i;
    if (1 === dim)
    {
        // vert
        ans = arguments[1];
        for (i=2; i<arguments.length; ++i)
        {
            ans = cat("vert", ans, arguments[i]);
        }
    }
    else if (2 === dim)
    {
        // horz
        ans = arguments[1];
        for (i=2; i<arguments.length; ++i)
        {
            ans = cat("horz", ans, arguments[i]);
        }
    }
    return ans;
};
fn.horzcat = function(A, B /*,..*/) {
    var ans, i;
    // horz
    ans = arguments[0];
    for (i=1; i<arguments.length; ++i)
    {
        ans = cat("horz", ans, arguments[i]);
    }
    return ans;
};
fn.vertcat = function(A, B /*,..*/) {
    var ans, i;
    // vert
    ans = arguments[0];
    for (i=1; i<arguments.length; ++i)
    {
        ans = cat("vert", ans, arguments[i]);
    }
    return ans;
};
