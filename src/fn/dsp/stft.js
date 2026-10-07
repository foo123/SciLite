function stft(inp, win, FFTLEN, OVERLAP, inv)
{
    // short-time fourier transform and inverse
    var out,
        i, j, k, summa,
        N, SEGMENTS,
        WLEN = FFTLEN < win.length ? FFTLEN : win.length,
        HOP = stdMath.max(1, WLEN - OVERLAP),
        zero = new complex(O, O),
        wx = new Array(FFTLEN),
        fx = new Array(FFTLEN);

    if (inv)
    {
        // inverse short-time fourier transform using ifft
        SEGMENTS = COLS(inp);
        N = stdMath.max(0, (SEGMENTS-1) * HOP + OVERLAP);
        out = array(N, zero);
        win = dotdiv(win, sum(dotmul(win, win)));

        for (j=0,i=0; i<SEGMENTS; ++i,j+=HOP)
        {
            // get segment
            for (k=0; k<FFTLEN; ++k)
            {
                fx[k] = inp[k][i];
                wx[k] = zero;
            }
            // ifft
            fft1(fx, true, wx);
            // overlap-add resynthesis
            // win should satisfy certain conditions (COLA) for exact inverse reconstruction
            for (k=0; k<WLEN; ++k)
            {
                if (j+k >= N) break;
                out[j+k] = scalar_add(out[j+k], scalar_mul(wx[k], win[k]));
            }
        }
    }
    else
    {
        // short-time fourier transform using fft
        // if (N - OVERLAP) / HOP is integer istft produces output of same length as original input
        N = inp.length;
        SEGMENTS = stdMath.floor(stdMath.max(0, N - OVERLAP) / HOP)+1;
        out = matrix(FFTLEN, SEGMENTS, zero);

        for (j=0,i=0; i<SEGMENTS; ++i,j+=HOP)
        {
            // apply win to segment with zero padding
            for (k=0; k<WLEN; ++k)
            {
                wx[k] = j+k < N ? scalar_mul(win[k], inp[j+k]) : zero;
                fx[k] = zero;
            }
            for (k=WLEN; k<FFTLEN; ++k)
            {
                wx[k] = zero;
                fx[k] = zero;
            }
            // fft
            fft1(wx, false, fx);
            // store
            for (k=0; k<FFTLEN; ++k)
            {
                out[k][i] = fx[k];
            }
        }
    }
    return out;
}
fn.stft = varargout(function(nargout, x) {
    var i = 2, fs = 2*pi,
        win = null, ovrl = null, nfft = null,
        ans, f = null, t = null;
    while (i < arguments.length)
    {
        if ((2 === i) && is_scalar(arguments[i]))
        {
            fs = _(real(arguments[i]));
            i += 1;
        }
        else if (("Window" === arguments[i]) && is_array(arguments[i+1]))
        {
            win = vec(arguments[i+1]);
            i += 2;
        }
        else if (("OverlapLength" === arguments[i]) && is_scalar(arguments[i+1]))
        {
            ovrl = stdMath.round(_(real(arguments[i+1])));
            i += 2;
        }
        else if (("FFTLength" === arguments[i]) && is_scalar(arguments[i+1]))
        {
            nfft = stdMath.round(_(real(arguments[i+1])));
            i += 2;
        }
        else
        {
            i += 1;
        }
    }
    if (null == win) win = vec(fn.hann(stdMath.min(x.length, 128), "periodic"));
    if (null == nfft) nfft = stdMath.max(128, win.length);
    if (null == ovrl) ovrl = stdMath.floor(0.75*win.length);
    x = vec(x);
    if (is_vector(x))
    {
        ans = realify(stft(complexify(x), win, nfft, ovrl, false));
    }
    else
    {
        not_supported("stft");
    }
    if (1 < nargout)
    {
        f = array(nfft, function(k) {
            return __((k/nfft /*- 0.5*//*nyquist rate*/)*fs);
        });
    }
    if (2 < nargout)
    {
        t = array(stdMath.floor((x.length - ovrl) / (win.length - ovrl)), function(m) {
            return __(m*stdMath.max(1, win.length - ovrl)/fs);
        });
    }
    return 1 < nargout ? [ans, f, t] : ans;
});
fn.istft = varargout(function(nargout, X) {
    var i = 2, fs = 2*pi,
        win = null, ovrl = null, nfft = null,
        ans, t = null;
    while (i < arguments.length)
    {
        if ((2 === i) && is_scalar(arguments[i]))
        {
            fs = _(real(arguments[i]));
            i += 1;
        }
        else if (("Window" === arguments[i]) && is_array(arguments[i+1]))
        {
            win = vec(arguments[i+1]);
            i += 2;
        }
        else if (("OverlapLength" === arguments[i]) && is_scalar(arguments[i+1]))
        {
            ovrl = stdMath.round(_(real(arguments[i+1])));
            i += 2;
        }
        else if (("FFTLength" === arguments[i]) && is_scalar(arguments[i+1]))
        {
            nfft = stdMath.round(_(real(arguments[i+1])));
            i += 2;
        }
        else
        {
            i += 1;
        }
    }
    if (null == win) win = vec(fn.hann(stdMath.min(X.length, 128), "periodic"));
    if (null == nfft) nfft = stdMath.max(128, win.length);
    if (null == ovrl) ovrl = stdMath.floor(0.75*win.length);
    if (is_matrix(X) && (nfft === ROWS(X)))
    {
        ans = realify(stft(complexify(X), win, nfft, ovrl, true));
    }
    else
    {
        not_supported("istft");
    }
    if (1 < nargout)
    {
        t = array(stdMath.floor((X.length - ovrl) / (win.length - ovrl)), function(m) {
            return __(m*stdMath.max(1, win.length - ovrl)/fs);
        });
    }
    return 1 < nargout ? [ans, t] : ans;
});
