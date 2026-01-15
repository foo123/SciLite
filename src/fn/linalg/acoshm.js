function acoshm(A)
{
    // adapted from https://github.com/higham/matrix-inv-trig-hyp/blob/master/acoshm.m
    var QT = schur(A, true, true), Q = QT[0], T = QT[1];
    /*var d = diag(T);
    if (any(imag(d) == 0 && 0 < real(d) && real(d) <= 1))
    {
        return Q*(logm(T + sqrtm(T - eye(size(T))) * sqrtm(T + eye(size(T)))))*ctranspose(Q);
    }
    else
    {*/
        // let acosm issue errors for eigenvals 1 or -1.
        return dotmul(mul(mul(Q, mul(signm_tri(dotmul(T, scalar_mul(J, i))), acosm(T))), ctranspose(Q)), i);
    /*}*/
}
fn.acoshm = function(A) {
    if (is_scalar(A)) return fn.acosh(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("acoshm");
    return acoshm(A);
};
