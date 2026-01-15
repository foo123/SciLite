fn.sinm = function(A) {
    if (is_scalar(A)) return fn.sin(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("sinm");
    return dotdiv(sub(expm(dotmul(A, i)), expm(dotmul(A, scalar_mul(J, i)))), scalar_mul(two, i));
};
