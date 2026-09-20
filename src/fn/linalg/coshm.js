fn.coshm = function(A) {
    if (is_scalar(A)) return fn.cosh(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("coshm");
    var exp = expm(A, 'with_neg');
    return dotdiv(add(exp['+'], exp['-']), two);//dotdiv(add(expm(A), expm(dotmul(A, J))), two);
};
