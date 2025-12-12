fn.cart2pol = function(x, y, z) {
    return [
        fn.atan2(y, x), // theta
        fn.sqrt(add(dotpow(x, 2), dotpow(y, 2))), // rho
        z // z
    ];
};