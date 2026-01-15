// window functions
fn.rectwin = function(L) {
    L = stdMath.round(_(sca(L, true)));
    return vec2col(array(L, function(n) {return I;}));
};
fn.triang = function(L) {
    L = stdMath.round(_(sca(L, true)));
    return vec2col((L & 1) ? array(L, function(n) {
        return __(n+1 <= (L+1)/2 ? (2*(n+1)/(L+1)) : (2 - 2*(n+1)/(L+1)));
    }) : array(L, function(n) {
        return __(n+1 <= L/2 ? ((2*(n+1)-1)/L) : (2 - (2*(n+1)-1)/L));
    }));
};
fn.gausswin = function(L, alpha) {
    L = stdMath.round(_(sca(L, true)));
    if (null == alpha) alpha = 2.5;
    alpha = _(sca(alpha, true));
    var sigma2 = (L-1)/(2*a);
    sigma2 = 2*sigma2*sigma2;
    return vec2col(array(L, function(n) {
        n -= (L-1)/2;
        return __(stdMath.exp(-(n*n)/sigma2));
    }));
};
fn.hamming = function(L, sflag) {
    L = stdMath.round(_(sca(L, true)));
    var N = sflag === "periodic" ? L : (L - 1);
    return vec2col(array(L, function(n) {
        return __(0.54 - 0.46*stdMath.cos(2*pi*n/N));
    }));
};
fn.hann = function(L, sflag) {
    L = stdMath.round(_(sca(L, true)));
    var N = sflag === "periodic" ? L : (L - 1);
    return vec2col(array(L, function(n) {
        return __(0.5*(1 - stdMath.cos(2*pi*n/N)));
    }));
};
fn.bartlett = function(L) {
    L = stdMath.round(_(sca(L, true)));
    if (1 === L) return I;
    var N = L - 1;
    return vec2col(array(L, function(n) {
        return __(n <= N/2 ? (2*n/N) : (2 - 2*n/N));
    }));
};
fn.barthannwin = function(L) {
    L = stdMath.round(_(sca(L, true)));
    if (1 === L) return I;
    var N = L - 1;
    return vec2col(array(L, function(n) {
        return __(0.62 - 0.48*stdMath.abs(n/N - 0.5) + 0.38*stdMath.cos(2*pi*(n/N-0.5)));
    }));
};
fn.blackman = function(L, sflag) {
    L = stdMath.round(_(sca(L, true)));
    var N = "periodic" === sflag ? L : (L - 1), M = N & 1 ? (N+1)/2 : (N/2);
    return vec2col(array(L, function(n, arr) {
        return n <= M-1 ? __(0.42-0.5*stdMath.cos(2*pi*n/(L-1))+0.08*stdMath.cos(4*pi*n/(L-1))) : arr[L-1-n];
    }));
};
fn.blackmanharris = function(L, sflag) {
    L = stdMath.round(_(sca(L, true)));
    var a0 = 0.35875, a1 = 0.48829, a2 = 0.14128, a3 = 0.01168,
        N = "periodic" === sflag ? L : (L - 1);
    return vec2col(array(L, function(n) {
        return __(a0 - a1*stdMath.cos(2*pi*n/N) + a2*stdMath.cos(4*pi*n/N) - a3*stdMath.cos(6*pi*n/N));
    }));
};