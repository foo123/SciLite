fn.cart2sph = varargout(function(nargout, x, y, z) {
    var rxy = add(dotpow(x, two), dotpow(y, two));
    return [
        fn.atan2(y, x), // azimuth
        fn.atan2(z, fn.sqrt(rxy)), // elevation
        fn.sqrt(add(rxy, dotpow(z, two))) // r
    ];
}, 3);