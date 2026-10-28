function rowspace(A, tol)
{
    // adapted from https://github.com/foo123/Abacus
    var pivots = ref(A, true, null, tol);
    return pivots[1].map(function(p) {
        return A[p[0]];
    }); // row vector
}
fn.rowspace = function(A, tol) {
    return rowspace(A, tol);
};
