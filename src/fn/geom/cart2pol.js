fn.cart2pol = varargout(function(nargout, x, y, z) {
    return [
        fn.atan2(y, x), // theta
        fn.sqrt(add(dotpow(x, two), dotpow(y, two))), // rho
        z // z
    ];
}, 3);