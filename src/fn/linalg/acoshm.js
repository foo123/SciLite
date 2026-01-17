function acoshm(A)
{
    // adapted from https://github.com/higham/matrix-inv-trig-hyp/blob/master/acoshm.m
    var n = ROWS(A),
        QT = schur(A, true, true),
        Q = QT[0],
        T = QT[1],
        d = diag(T),
        In = eye(n);
    if (any(d, function(d) {return n_eq(imag(d), O) && n_lt(O, real(d)) && n_le(real(d), I);}))
    {
        return mul(mul(Q, logm_tri(add(T, mul_tri(sqrtm_tri(sub(T, In)), sqrtm_tri(add(T, In)))))), ctranspose(Q));
    }
    else
    {
        // let acosm issue errors for eigenvals 1 or -1.
        return dotmul(mul(mul(Q, mul_tri(signm_tri(dotmul(T, scalar_mul(J, i))), acosm(T))), ctranspose(Q)), i);
    }
}
fn.acoshm = function(A) {
    if (is_scalar(A)) return fn.acosh(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("acoshm");
    return acoshm(A);
};
