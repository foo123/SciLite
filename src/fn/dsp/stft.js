function stft(inp, win, FFTLEN, OVERLAP, inv)
{
    // short-time fourier transform and inverse
    var out,
        i, j, k,
        N, SEGMENTS,
        WLEN = FFTLEN < win.length ? FFTLEN : win.length,
        HOP = stdMath.max(1, WLEN - OVERLAP),
        zero = new complex(O, O),
        wx = new Array(FFTLEN),
        fx = new Array(FFTLEN),
        pad = stdMath.floor((FFTLEN-WLEN)/2);

    if (WLEN < win.length) win = win.slice(0, WLEN);
    win = dotdiv(win, norm(win));
    if (inv)
    {
        // inverse short-time fourier transform using ifft
        SEGMENTS = COLS(inp);
        N = SEGMENTS * HOP;
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
                if (j+pad+k >= N) break;
                out[j+pad+k] = scalar_add(out[j+pad+k], scalar_mul(wx[pad+k], win[k]));
            }
        }
    }
    else
    {
        // short-time fourier transform using fft
        // if (N - OVERLAP) / HOP is integer istft produces output of same length as original input
        N = inp.length;
        out = [];
        for (j=0,i=0; j<N; ++i,j+=HOP)
        {
            // apply win to segment with zero padding
            for (k=0; k<pad; ++k)
            {
                wx[k] = zero;
                fx[k] = zero;
            }
            for (k=0; k<WLEN; ++k)
            {
                wx[pad+k] = j+k < N ? scalar_mul(win[k], inp[j+k]) : zero;
                fx[pad+k] = zero;
            }
            for (k=pad+WLEN; k<FFTLEN; ++k)
            {
                wx[k] = zero;
                fx[k] = zero;
            }
            // fft
            fft1(/*fftshift(*/wx/*)*/, false, fx);
            // store
            out.push(fx.slice());
        }
        out = transpose(out);
    }
    return out;
}
fn.stft = varargout(namevalueargs(function(nargout, x) {
    var nv = arguments[arguments.length-1],
        win = null, ovrl = null, nfft = null,
        fs = 2*pi, f = null, t = null, ans;
    if ((2 < arguments.length) && is_scalar(arguments[2]))
    {
        fs = _(real(arguments[2]));
    }
    x = vec(x);
    if (is_vector(x))
    {
        win = nv.Window;
        nfft = nv.FFTLength;
        ovrl = nv.OverlapLength;
        win = null == win ? vec(fn.hann(128, "periodic")) : vec(win);
        nfft = null == nfft ? stdMath.max(128, win.length) : stdMath.round(_(real(nfft)));
        ovrl = null == ovrl ? stdMath.floor(0.75*win.length) : stdMath.round(_(real(ovrl)));
        ans = realify(stft(complexify(x), win, nfft, ovrl, false));
        if (1 < nargout)
        {
            f = array(nfft, function(k) {
                return __((k/nfft - 0.5/*nyquist rate*/)*fs);
            });
        }
        if (2 < nargout)
        {
            t = array(COLS(ans), function(m) {
                return __(m*stdMath.max(1, win.length - ovrl + 1)/fs);
            });
        }
    }
    else
    {
        not_supported("stft");
    }
    return 1 < nargout ? [ans, f, t] : ans;
}, {
   Window: null,
   FFTLength: null,
   OverlapLength: null
}));
fn.istft = varargout(namevalueargs(function(nargout, X) {
    var nv = arguments[arguments.length-1],
        win = null, ovrl = null, nfft = null,
        fs = 2*pi, t = null, ans;
    if ((2 < arguments.length) && is_scalar(arguments[2]))
    {
        fs = _(real(arguments[2]));
    }
    if (is_matrix(X))
    {
        win = nv.Window;
        nfft = nv.FFTLength;
        ovrl = nv.OverlapLength;
        win = null == win ? vec(fn.hann(128, "periodic")) : vec(win);
        nfft = null == nfft ? stdMath.max(128, win.length) : stdMath.round(_(real(nfft)));
        ovrl = null == ovrl ? stdMath.floor(0.75*win.length) : stdMath.round(_(real(ovrl)));
        if (nfft === ROWS(X))
        {
            ans = realify(stft(complexify(X), win, nfft, ovrl, true));
            if (1 < nargout)
            {
                t = array(COLS(X), function(m) {
                    return __(m*stdMath.max(1, win.length - ovrl + 1)/fs);
                });
            }
        }
        else
        {
            not_supported("istft");
        }
    }
    else
    {
        not_supported("istft");
    }
    return 1 < nargout ? [ans, t] : ans;
}, {
   Window: null,
   FFTLength: null,
   OverlapLength: null
}));
