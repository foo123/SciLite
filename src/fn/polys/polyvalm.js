function hornerm(p, A)
{
    // adapted from https://github.com/foo123/Abacus
    if (!p.length) return zeros(ROWS(A), COLS(A));
    var n = p.length, i = 0, k = ROWS(A), v = eye(k, p[0]);
    while (i+1 < n)
    {
        ++i;
        v = add(mul(v, A), eye(k, p[i]));
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
