fn.pol2cart = function(theta, rho, z) {
    return [
        dotmul(rho, fn.cos(theta)), // x
        dotmul(rho, fn.sin(theta)), // y
        z // z
    ];
};