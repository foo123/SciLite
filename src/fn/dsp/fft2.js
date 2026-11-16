// adapted from https://github.com/foo123/FILTER.js
function fft2(x, inv, output)
{
    var nx = x.length, ny = x[0].length;
    if (0 >= nx || 0 >= ny) return;
    var ret = false, i, j,
        row = new Array(nx),
        col = new Array(ny),
        frow = new Array(nx),
        fcol = new Array(ny);

    if (null == output)
    {
        output = new Array(nx);
        for (i=0; i<nx; ++i) output[i] = new Array(ny);
        ret = true;
    }
    for (j=0; j<ny; ++j)
    {
        for (i=0; i<nx; ++i)
        {
            row[i] = x[i][j];
        }
        fft1(row, inv, frow);
        for (i=0; i<nx; ++i)
        {
            output[i][j] = frow[i];
        }
    }
    for (i=0; i<nx; ++i)
    {
        for (j=0; j<ny; ++j)
        {
            col[j] = output[i][j];
        }
        fft1(col, inv, fcol);
        for (j=0; j<ny; ++j)
        {
            output[i][j] = fcol[j];
        }
    }

    if (ret) return output;
}
fn.fft2 = function(x, m, n) {
    if (!is_matrix(x)) not_supported("fft2");
    return realify(fft2(complexify(fft_sz(x, [m, n])), false));
};
fn.ifft2 = function(x, m, n) {
    if (!is_matrix(x)) not_supported("ifft2");
    return realify(fft2(complexify(fft_sz(x, [m, n])), true));
};
