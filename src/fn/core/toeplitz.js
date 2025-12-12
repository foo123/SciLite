fn.toeplitz = function(c, r) {
    if (1 === arguments.length)
    {
        r = vec(c);
        return matrix(r.length, r.length, function(i, j) {
            return i === j ? r[0] : (j > i ? r[stdMath.abs(i-j)] : scalar_conj(r[stdMath.abs(i-j)]));
        });
    }
    else
    {
        c = vec(c);
        r = vec(r);
        return matrix(c.length, r.length, function(i, j) {
            return i === j ? c[0] : (j > i ? r[stdMath.abs(i-j)] : c[stdMath.abs(i-j)]);
        });
    }
};