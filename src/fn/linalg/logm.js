function logm(A)
{
    // TODO
    return A;
}
fn.logm = function(A) {
    if (is_scalar(A)) return fn.log(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("logm");
    return logm(A);
});
