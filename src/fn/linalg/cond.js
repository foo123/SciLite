fn.cond = function(A, p) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported("cond");
    var invA = inv(A);
    if (!invA || !invA.length) return inf;
    if (null == p) p = 2;
    return scalar_mul(norm(A, p), norm(invA, p));
};
