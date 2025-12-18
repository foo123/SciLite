function charpoly(A)
{
    // adapted from https://github.com/foo123/Abacus
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("charpoly");
    var rows = ROWS(A), columns = COLS(A), k, n, M, coeff;
    n = rows;
    coeff = new Array(n+1);
    M = zeros(n, n); // zero
    coeff[n] = I;
    for (k=1; k<=n; ++k)
    {
        M = mul(A, M).map(function(vi, i) {
            return vi.map(function(vij, j) {
                return i === j ? scalar_add(vij, coeff[n-k+1]) : vij;
            });
        });
        coeff[n-k] = scalar_div(trace(mul(A, M)), -k);
    }
    return realify(coeff.reverse());
}
fn.charpoly = charpoly;
