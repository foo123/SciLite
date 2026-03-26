function cat_horz(A, B)
{
    if (is_1d(A) && is_1d(B))
    {
        return A.concat(B);
    }
    else if (is_2d(A) && is_2d(B) && (ROWS(A) === ROWS(B)))
    {
        return A.map(function(Ai, i) {
            return Ai.concat(B[i]);
        });
    }
}
function cat_vert(A, B)
{
    if (is_1d(A) && is_1d(B))
    {
        return A.concat(B);
    }
    else if (is_2d(A) && is_2d(B) && (COLS(A) === COLS(B)))
    {
        return A.concat(B);
    }
}
function cat(dim, A, B)
{
    var sizeA = size(A), sizeB = size(B);
    if (dim > sizeA.length)
    {
        sizeA = sizeA.concat(array(dim-sizeA.length, 1));
    }
    if (dim > sizeB.length)
    {
        sizeB = sizeB.concat(array(dim-sizeB.length, 1));
    }
    return tensorview(A, {shape:sizeA}).concat(tensorview(B, {shape:sizeB}), dim-1).toNDArray();
    /*if (2 === dim)
    {
        return cat_horz(A, B);
    }
    if (1 === dim)
    {
        return cat_vert(A, B);
    }
    not_supported("cat");*/
}
fn.cat = function(dim, A, B /*,..*/) {
    dim = _(dim);
    var ans = [], i;
    ans = arguments[1];
    for (i=2; i<arguments.length; ++i)
    {
        ans = cat(dim, ans, arguments[i]);
    }
    /*if (1 === dim)
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
    }*/
    return ans;
};
fn.horzcat = function(A, B /*,..*/) {
    var ans, i;
    // horz
    ans = arguments[0];
    for (i=1; i<arguments.length; ++i)
    {
        ans = cat(2, ans, arguments[i]);
    }
    return ans;
};
fn.vertcat = function(A, B /*,..*/) {
    var ans, i;
    // vert
    ans = arguments[0];
    for (i=1; i<arguments.length; ++i)
    {
        ans = cat(1, ans, arguments[i]);
    }
    return ans;
};
