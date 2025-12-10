function rowspace(A, eps)
{
    // adapted from https://github.com/foo123/Abacus
    var pivots = ref(A, true, null, eps);
    return pivots[1].map(function(p) {
        return A[p[0]];
    }); // row vector
}
fn.rowspace = function(A, tol) {
    return rowspace(A, tol);
};
