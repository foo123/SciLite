function hadamard(n)
{
    if (1 === n)
    {
        return [[I]];
    }
    if (2 === n)
    {
        return [[I, I], [I, J]];
    }
    if (4 === n)
    {
        return [[I, I, I, I], [I, J, I, J], [I, I, J, J], [I, J, J, I]];
    }
    if (0 === (n % 4))
    {
        var HH = hadamard(n/2);
        return HH.length ? kron([[I, I], [I, J]], HH) : [];
    }
    return [];
}
fn.hadamard = function(n) {
    return hadamard(_(n));
};