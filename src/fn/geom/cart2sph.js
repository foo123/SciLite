fn.cart2sph = function(x, y, z) {
    var rxy = add(dotpow(x, 2), dotpow(y, 2));
    return [
        fn.atan2(y, x), // azimuth
        fn.atan2(z, fn.sqrt(rxy)), // elevation
        fn.sqrt(add(rxy, dotpow(z, 2))) // r
    ];
};