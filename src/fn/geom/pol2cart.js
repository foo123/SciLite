fn.pol2cart = varargout(function(nargout, theta, rho, z) {
    return [
        dotmul(rho, fn.cos(theta)), // x
        dotmul(rho, fn.sin(theta)), // y
        z // z
    ];
}, 3);