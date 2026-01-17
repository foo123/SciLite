fn.asinhm = function(A) {
    // adapted from https://github.com/higham/matrix-inv-trig-hyp/blob/master/asinhm.m
    if (is_scalar(A)) return fn.asinh(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("asinhm");
    return dotmul(fn.asinm(dotmul(A, scalar_mul(J, i))), i);
};
