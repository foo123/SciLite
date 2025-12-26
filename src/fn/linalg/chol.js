fn.chol = varargout(function(nargout, A, triangle) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A) || (ROWS(A) !== COLS(A)) /*|| !EQU(A, ctranspose(A))*/) not_supported("chol");
    triangle = triangle || "upper";
    var ans = ldl(A, triangle);
    if (!ans.length) not_supported("chol");
    return "lower" === triangle ? (mul(ans[0], fn.sqrt(ans[1]))) : ctranspose(mul(ans[0], fn.sqrt(ans[1])));
});
