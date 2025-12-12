function hadamard(n)
{
    if (1 === n) return [[I]];
    if (2 === n) return [[I, I], [I, J]];
    if (4 === n) return [[I, I, I, I], [I, J, I, J], [I, I, J, J], [I, J, J, I]];
    if (0 === (n % 4)) return kron([[I, I], [I, J]], hadamard(n/2));
    return [];
}
fn.hadamard = function(n) {
    return hadamard(_(n));
};