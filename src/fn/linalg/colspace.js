function colspace(A, tol)
{
    // adapted from https://github.com/foo123/Abacus
    var pivots = ref(A, true, null, tol);
    return pivots[1].map(function(p) {
        return array(A.length, function(i) {
            return A[i][p[1]];
        });
    }); // column vector
}
fn.colspace = function(A, tol) {
    return colspace(A, tol);
};
