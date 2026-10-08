fn.asinm = function(A) {
    // adapted from https://github.com/higham/matrix-inv-trig-hyp/blob/master/asinm.m
    if (is_scalar(A)) return fn.asin(A);
    if (!is_matrix(A) || (ROWS(A) !== COLS(A))) not_supported("asinm");
    if (1 === ROWS(A)) return [[fn.asin(A[0][0])]];
    return sub(eye(ROWS(A), __(pi/2)), acosm(A));
};
