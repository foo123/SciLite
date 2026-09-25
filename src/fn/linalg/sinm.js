fn.sinm = function(A) {
    if (is_scalar(A)) return fn.sin(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("sinm");
    if (1 === ROWS(A)) return [[fn.sin(A[0][0])]];
    var exp = expm(dotmul(A, i), 'with_neg');
    return dotdiv(sub(exp['+'], exp['-']), scalar_mul(two, i));//dotdiv(sub(expm(dotmul(A, i)), expm(dotmul(A, scalar_mul(J, i)))), scalar_mul(two, i));
};
