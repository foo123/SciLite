// adapted from https://github.com/foo123/FILTER.js
function fftn(x, inv, output)
{
    var sx = is_1d(x) ? [x.length] : size(x), dx = sx.length;
    if (sx.filter(function(si) {return 0 >= si;}).length) return;
    var ret = false, sxx, xx, fxx, j, jn = sx[dx-1];

    if (1 === dx) return fft1(x, inv, output);

    if (null == output)
    {
        output = ndarray(sx.slice(), O);
        ret = true;
    }

    sxx = sx.slice(0, -1);
    xx = ndarray(sxx, O);
    fxx = ndarray(sxx.slice(), O);
    for (j=0; j<jn; ++j)
    {
        ndarray.indices(sxx, function(i) {
            var xxi = xx, xi = x, _, n = dx-2;
            for (_=0; _<n; ++_) {xi = xi[i[_]]; xxi = xxi[i[_]];}
            xxi[i[n]] = xi[i[n]][j];
        });
        fftn(xx, inv, fxx);
        ndarray.indices(sxx, function(i) {
            var fxxi = fxx, oi = output, _, n = dx-1;
            for (_=0; _<n; ++_) {oi = oi[i[_]]; fxxi = fxxi[i[_]];}
            oi[j] = fxxi;
        });
    }
    xx = array(jn, O);
    fxx = array(jn, O);
    ndarray.indices(sxx, function(i) {
        var oi = output, _, n = dx-1;
        for (_=0; _<n; ++_) oi = oi[i[_]];
        for (j=0; j<jn; ++j)
        {
            xx[j] = oi[j];
        }
        fft1(xx, inv, fxx);
        for (j=0; j<jn; ++j)
        {
            oi[j] = fxx[j];
        }
    });

    if (ret) return output;
}
fn.fftn = function(x, sz) {
    if (!is_array(x)) not_supported("fftn");
    return realify(fftn(complexify(fft_sz(is_1d(x) ? [x] : x, sz)), false));
};
fn.ifftn = function(x, sz) {
    if (!is_array(x)) not_supported("ifftn");
    return realify(fftn(complexify(fft_sz(is_1d(x) ? [x] : x, sz)), true));
};
