function hornerm(p, A)
{
    // adapted from https://github.com/foo123/Abacus
    var O = __(0);
    if (!p.length) return O;
    var n = p.length, i = 0, k = ROWS(A),
        v = matrix(k, k, function(r, c) {return r === c ? p[0] : O;});
    while (i+1 < n)
    {
        ++i;
        v = add(mul(v, A), matrix(k, k, function(r, c) {return r === c ? p[i] : O;}));
    }
    return v;
}
fn.polyvalm = function(p, A) {
    p = vec(p);
    if (!is_vector(p)) not_supported("polyvalm");
    if (is_matrix(A) && (ROWS(A) === COLS(A))) return realify(hornerm(p, A));
    else if (is_scalar(A)) return realify(horner(p, A));
    else if (is_vector(A)) return A.map(function(ai) {return realify(horner(p, ai));});
    not_supported("polyvalm");
};
