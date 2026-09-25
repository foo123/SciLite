fn.sinhm = function(A) {
    if (is_scalar(A)) return fn.sinh(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("sinhm");
    if (1 === ROWS(A)) return [[fn.sinh(A[0][0])]];
    var exp = expm(A, 'with_neg');
    return dotdiv(sub(exp['+'], exp['-']), two);//dotdiv(sub(expm(A), expm(dotmul(A, J))), two);
};
