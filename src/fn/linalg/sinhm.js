fn.sinhm = function(A) {
    if (is_scalar(A)) return fn.sinh(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("sinhm");
    return dotdiv(sub(expm(A), expm(dotmul(A, J))), two);
};
