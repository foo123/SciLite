fn.planerot = varargout(function(nargout, x) {
    x = vec(x);
    if (!is_vector(x) || (2 !== x.length)) not_supported("planerot");
    var g = compute_givens(x[0], x[1]),
        G = [
            [g[0],              g[1]],
            [scalar_neg(g[1]),  g[0]]
        ];
    return 1 < nargout ? [G, mul(G, vec2col(x))] : G;
});