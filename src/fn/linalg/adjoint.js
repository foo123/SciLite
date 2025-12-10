function minor(A, ai, aj, cofactor)
{
    var rows = ROWS(A), columns = COLS(A), m;
    if (rows !== columns) return null;
    if (1 >= rows) return 0;
    ai = +(ai||0); aj = +(aj||0);
    if (ai < 0 || ai >= rows || aj < 0 || aj >= columns) return null;
    m = det(matrix(rows-1, columns-1, function(i, j) {
        if (i >= ai) ++i;
        if (j >= aj) ++j;
        return A[i][j];
    }));
    if ((true === cofactor) && ((ai+aj)&1)) m = scalar_neg(m);
    return m;
}
function adjoint(A)
{
    // adapted from https://github.com/foo123/Abacus
    return matrix(COLS(A), ROWS(A), function(j, i) {
        return minor(A, i, j, true);
    });
}
fn.adjoint = function(A) {
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("adjoint");
    return adjoint(A);
};
