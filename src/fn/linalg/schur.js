function schur(A, wantu)
{
    // schur via qr algorithm
    var n = ROWS(A), H, U, QR,
        m, sigma, Isigma,
        iter, eps = __(1e-8);

    // reduce to hessenberg Form
    H = hess(A, null, wantu);
    if (wantu)
    {
        U = H[0];
        H = H[1];
    }

    // qr algorithm for hessenberg with shifts
    for (m=n-1; m>0; --m)
    {
        for (iter=1; iter<=100; ++iter)
        {
            sigma = H[m][m];
            Isigma = eye(n, sigma);
            QR = qr(sub(H, Isigma), true);
            H = add(mul(QR[1], QR[0]), Isigma);
            if (wantu) U = mul(U, QR[0]);
            if (n_le(scalar_abs(H[m][m-1]), eps)) break;
        }
    }
    return wantu ? [U, H] : H;
}
fn.schur = varargout(function(nargout, A) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("schur");
    return schur(A, 1 < nargout);
});
