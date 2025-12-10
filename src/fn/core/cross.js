fn.cross = function(a, b) {
    a = vec(a); b = vec(b);
    if (!is_vector(a) || (3 !== a.length)) throw "cross: input 1 not vector of length 3";
    if (!is_vector(b) || (3 !== b.length)) throw "cross: input 2 not vector of length 3";
    return [
        scalar_sub(scalar_mul(a[1], b[2]), scalar_mul(a[2], b[1])),
        scalar_sub(scalar_mul(a[2], b[0]), scalar_mul(a[0], b[2])),
        scalar_sub(scalar_mul(a[0], b[1]), scalar_mul(a[1], b[0]))
    ];
};
