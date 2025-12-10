function rank(A)
{
    // adapted from https://github.com/foo123/Abacus
    var pivots = ref(A, true);
    return pivots[1].length;
}
fn.rank = function(A) {
    if (is_scalar(A)) A = [[A]];
    if (!is_matrix(A)) not_supported("rank");
    return rank(A);
};
