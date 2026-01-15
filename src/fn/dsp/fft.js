// adapted from https://github.com/foo123/FILTER.js
var SIN = {}, COS = {};
function sine(i)
{
    var sin_i;
    sin_i = SIN[i];
    if (null == sin_i) SIN[i] = sin_i = stdMath.sin(pi/i);
    return sin_i;
}
function cosine(i)
{
    var cos_i;
    cos_i = COS[i];
    if (null == cos_i) COS[i] = cos_i = stdMath.cos(pi/i);
    return cos_i;
}
function bitrevidx(idx, n)
{
    var rev_idx = 0;

    while (1 < n)
    {
        rev_idx <<= 1;
        rev_idx += idx & 1;
        idx >>= 1;
        n >>= 1;
    }
    return rev_idx;
}
function bitrev(x, x2)
{
    var n = x.length, done = {}, i, j, t;

    for (i=0; i<n; ++i)
    {
        if (1 === done[i]) continue;

        j = bitrevidx(i, n);

        t = x[j];
        x2[j] = x[i];
        x2[i] = t;

        done[j] = 1;
    }
}
function first_odd_fac(n)
{
    var sqrt_n = stdMath.sqrt(n), f = 3;

    while (f <= sqrt_n)
    {
        if (0 === (n % f)) return f;
        f += 2;
    }
    return n;
}
function fft1_r(x, inv, output)
{
    var n = x.length;
    var i, j, t;
    if (1 === n)
    {

        output[0] = x[0];
        return;
    }
    for (i=0; i<n; ++i)
    {
        output[i] = new complex(O, O);
    }

    // Use the lowest odd factor, so we are able to use _fft_i in the
    // recursive transforms optimally.
    var p = first_odd_fac(n), m = n / p,
        normalisation = __(1 / stdMath.sqrt(p)),
        recursive_result = new Array(m),
        recursive_result2 = new Array(m),
        del_f_r, del_f_i, f_r, f_i, _real, _imag;

    // Loops go like O(n Σ p_i), where p_i are the prime factors of n.
    // for a power of a prime, p, this reduces to O(n p log_p n)
    for (j=0; j<p; ++j)
    {
        for (i=0; i<m; ++i)
        {
            recursive_result[i] = x[i * p + j];
        }
        // Don't go deeper unless necessary to save allocs.
        if (m > 1)
        {
            fft1(recursive_result, inv, recursive_result2);
            t = recursive_result;
            recursive_result = recursive_result2;
            recursive_result2 = t;
        }

        del_f_r = __(stdMath.cos(2*pi*j/n));
        del_f_i = __((inv ? -1 : 1) * stdMath.sin(2*pi*j/n));
        f_r = I;
        f_i = O;

        for (i=0; i<n; ++i)
        {
            _real = n_mul(normalisation, recursive_result[i % m].re);
            _imag = n_mul(normalisation, recursive_result[i % m].im);

            output[i] = output[i].add(new complex(
                n_sub(n_mul(_real, f_r), n_mul(_imag, f_i)),
                n_add(n_mul(_imag, f_r), n_mul(_real, f_i))
            ));

            _real = n_sub(n_mul(f_r, del_f_r), n_mul(f_i, del_f_i));
            _imag = n_add(n_mul(f_r, del_f_i), n_mul(f_i, del_f_r));
            f_r = _real;
            f_i = _imag;
        }
    }
}
var SQRT1_2 = stdMath.SQRT1_2;
update.push(function() {
    SQRT1_2 = __(stdMath.SQRT1_2);
});
function fft1_i(x, inv, output)
{
    // Loops go like O(n log n):
    //   w ~ log n; i,j ~ n
    var n = x.length, w = 1,
        del_f_r, del_f_i, i, k, j, t, s,
        f_r, f_i, l_index, r_index,
        left_r, left_i, right_r, right_i;
    bitrev(x, output);
    while (w < n)
    {
        del_f_r = __(cosine(w));
        del_f_i = __((inv ? -1 : 1) * sine(w));
        k = n/(2*w);
        for (i=0; i<k; ++i)
        {
            f_r = I;
            f_i = O;
            for (j=0; j<w; ++j)
            {
                l_index = 2*i*w + j;
                r_index = l_index + w;

                left_r = output[l_index].re;
                left_i = output[l_index].im;
                t = output[r_index].re;
                s = output[r_index].im;
                right_r = n_sub(n_mul(f_r, t), n_mul(f_i, s));
                right_i = n_add(n_mul(f_i, t), n_mul(f_r, s));

                output[l_index] = new complex(n_mul(n_add(left_r, right_r), SQRT1_2), n_mul(n_add(left_i, right_i), SQRT1_2));
                output[r_index] = new complex(n_mul(n_sub(left_r, right_r), SQRT1_2), n_mul(n_sub(left_i, right_i), SQRT1_2));

                t = n_sub(n_mul(f_r, del_f_r), n_mul(f_i, del_f_i));
                s = n_add(n_mul(f_r, del_f_i), n_mul(f_i, del_f_r));
                f_r = t;
                f_i = s;
            }
        }
        w <<= 1;
    }
}
function fft1(x, inv, output)
{
    var n = x.length;
    if (0 >= n) return;
    var ret = false;
    if (null == output)
    {
        output = new Array(n);
        ret = true;
    }
    if (n & (n - 1)) fft1_r(x, inv, output)
    else fft1_i(x, inv, output);
    if (ret) return output;
}
fn.fft = function(x) {
    x = vec(x);
    if (is_matrix(x))
    {
        return array(COLS(x), function(column) {
            return realify(fft1(complexify(COL(x, column)), false));
        });
    }
    else if (is_vector(x))
    {
        return realify(fft1(complexify(x), false));
    }
    not_supported("fft");
};
fn.ifft = function(x) {
    x = vec(x);
    if (is_matrix(x))
    {
        return array(COLS(x), function(column) {
            return realify(fft1(complexify(COL(x, column)), true));
        });
    }
    else if (is_vector(x))
    {
        return realify(fft1(complexify(x), true));
    }
    not_supported("ifft");
};
function fftshift(x, dim)
{
    if (is_vector(x))
    {
        var N = x.length, N_2 = stdMath.ceil(N / 2);
        return array(N, function(i) {
            return x[(i+N_2) % N];
        });
    }
    else if (is_matrix(x))
    {
        var N = ROWS(x), N_2 = stdMath.ceil(N / 2),
            M = COLS(x), M_2 = stdMath.ceil(M / 2);
        if (1 === dim)
        {
            return matrix(N, M, function(i, j) {
                return x[(i+N_2) % N][j];
            });
        }
        else if (2 === dim)
        {
            return matrix(N, M, function(i, j) {
                return x[i][(j+M_2) % M];
            });
        }
        else
        {
            return matrix(N, M, function(i, j) {
                return x[(i+N_2) % N][(j+M_2) % M];
            });
        }
    }
    return x;
}
fn.fftshift = function(x, dim) {
    x = vec(x);
    if (is_vector(x) || is_matrix(x))
    {
        return fftshift(x, is_scalar(dim) ? _(real(dim)) : null);
    }
    return x;
};