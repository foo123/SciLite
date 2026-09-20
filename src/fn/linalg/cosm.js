fn.cosm = function(A) {
    if (is_scalar(A)) return fn.cos(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("cosm");
    var exp = expm(dotmul(A, i), 'with_neg');
    return dotdiv(add(exp['+'], exp['-']), two);//dotdiv(add(expm(dotmul(A, i)), expm(dotmul(A, scalar_mul(J, i)))), two);
};
