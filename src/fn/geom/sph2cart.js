fn.sph2cart = function(azimuth, elevation, r) {
    return [
        dotmul(r, dotmul(fn.cos(elevation), fn.cos(azimuth))), // x
        dotmul(r, dotmul(fn.cos(elevation), fn.sin(azimuth))), // y
        dotmul(r, fn.sin(elevation)) // z
    ];
};