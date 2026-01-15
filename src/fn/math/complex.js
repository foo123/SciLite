complex = function complex(re, im, type) {
    var self = this;
    if (!is_instance(self, complex)) return new complex(re, im, type);
    if (is_complex(re))
    {
        self.re = re.re;
        self.im = re.im;
    }
    else
    {
        im = im || O;
        if ('polar' === type)
        {
            self._rho = realMath.abs(re);
            self.re = n_mul(self._rho, realMath.cos(im));
            self.im = n_mul(self._rho, realMath.sin(im));
        }
        else
        {
            self.re = re;
            self.im = im;
        }
    }
};
complex.prototype = {
    constructor: complex,
    re: 0,
    im: 0,
    _rho: null,
    _rho2: null,
    _theta: null,
    _sgn: null,
    _str: null,
    abs: function(sq) {
        var self = this;
        if (null == self._rho)
        {
            self._rho = n_hypot(self.re, self.im);
        }
        return self._rho;

    },
    norm2: function() {
        var self = this;
        if (null == self._rho2)
        {
            self._rho2 = n_pow(self.abs(), two);
        }
        return self._rho2;

    },
    angle: function() {
        var self = this;
        if (null == self._theta)
        {
            self._theta = /*n_eq(self.re, O) ? __((n_lt(self.im, O) ? -1 : 1)*pi/2) :*/ realMath.atan2(self.im, self.re);
        }
        return self._theta;
    },
    sign: function() {
        var self = this;
        if (null == self._sgn)
        {
            self._sgn = !n_eq(self.im, O) ? self.div(self.abs())/*new complex(realMath.cos(self.angle()), realMath.sin(self.angle()))*/ : realMath.sign(self.re);
            if (is_complex(self._sgn)) self._sgn._sgn = self._sgn;
        }
        return self._sgn;
    },
    add: function(other) {
        var self = this;
        if (is_num(other))
        {
            return new complex(n_add(self.re, other), self.im);
        }
        else
        {
            return new complex(n_add(self.re, other.re), n_add(self.im, other.im));
        }
    },
    sub: function(other) {
        var self = this;
        if (is_num(other))
        {
            return new complex(n_sub(self.re, other), self.im);
        }
        else
        {
            return new complex(n_sub(self.re, other.re), n_sub(self.im, other.im));
        }
    },
    mul: function(other) {
        var self = this;
        if (is_num(other))
        {
            return new complex(n_eq(self.re, O) ? O : n_mul(self.re, other), n_eq(self.im, O) ? O : n_mul(self.im, other));
        }
        else
        {
            // fast complex multiplication
            var x1 = self.re, x2 = other.re,
                y1 = self.im, y2 = other.im,
                k1 = n_mul(x1, n_add(x2, y2)),
                k2 = n_mul(y2, n_add(x1, y1)),
                k3 = n_mul(x2, n_sub(y1, x1));
            return new complex(n_sub(k1, k2), n_add(k1, k3));
        }
    },
    div: function(other) {
        var self = this;
        if (is_num(other))
        {
            return new complex(n_eq(self.re, O) ? O : n_div(self.re, other), n_eq(self.im, O) ? O : n_div(self.im, other));
        }
        else
        {
            // fast complex multiplication for inverse
            var m = other.norm2(),
                x1 = self.re,
                x2 = n_div(other.re, m),
                y1 = self.im,
                y2 = n_neg(n_div(other.im, m)),
                k1 = n_mul(x1, n_add(x2, y2)),
                k2 = n_mul(y2, n_add(x1, y1)),
                k3 = n_mul(x2, n_sub(y1, x1));
            return new complex(n_sub(k1, k2), n_add(k1, k3));
        }
    },
    pow: function(other) {
        var self = this, invother;
        if (is_nan(other))
        {
            return nan;
        }
        if (is_num(other))
        {
            return new complex(n_pow(self.abs(), other), n_mul(self.angle(), other), 'polar');
        }
        if (is_complex(other))
        {
            var rho = self.abs(), theta = self.angle();
            return (new complex(n_pow(rho, other.re), n_mul(other.im, realMath.log(rho)), 'polar')).mul(new complex(realMath.exp(n_neg(n_mul(other.im, theta))), n_mul(theta, other.re), 'polar'));
        }
    },
    neg: function() {
        return new complex(n_neg(this.re), n_neg(this.im));
    },
    conj: function() {
        return new complex(this.re, n_neg(this.im));
    },
    inv: function() {
        var self = this, m = self.norm2();
        return new complex(n_div(self.re, m), n_neg(n_div(self.im, m)));
    },
    toString: function() {
        var self = this;
        if (null == self._str)
        {
            self._str = num2str(self.re) + (n_lt(self.im, O) ? ' - ' : ' + ') + num2str(realMath.abs(self.im))+'i';
        }
        return self._str;
    },
    valueOf: function() {
        return _(this.re);
    }
};
i = new complex(O, I);
ze = new complex(constant.e, O);

complexMath = {
    floor: function(z) {
        return new complex(realMath.floor(z.re), realMath.floor(z.im));
    },
    ceil: function(z) {
        return new complex(realMath.ceil(z.re), realMath.ceil(z.im));
    },
    round: function(z) {
        return new complex(realMath.round(z.re), realMath.round(z.im));
    },
    fix: function(z) {
        return new complex(realMath.fix(z.re), realMath.fix(z.im));
    },
    sign: function(z) {
        return z.sign();
    },
    sqrt: function(z) {
        return new complex(realMath.sqrt(z.abs()), n_div(z.angle(), two), 'polar');
    },
    exp: function(z) {
        return ze.pow(z);
    },
    log: function(z) {
        return new complex(realMath.log(z.abs()), z.angle());
    },
    log10: function(z) {
        return complexMath.log(z).div(log_10);
    },
    log2: function(z) {
        return complexMath.log(z).div(log_2);
    },
    sin: function(z) {
      return new complex(n_mul(realMath.sin(z.re), realMath.cosh(z.im)), n_mul(realMath.cos(z.re), realMath.sinh(z.im)));
    },
    cos: function(z) {
      return new complex(n_mul(realMath.cos(z.re), realMath.cosh(z.im)), n_neg(n_mul(realMath.sin(z.re), realMath.sinh(z.im))));
    },
    tan: function(z) {
        return complexMath.sin(z).div(complexMath.cos(z));
    },
    sinh: function(z) {
      return new complex(n_mul(realMath.sinh(z.re), realMath.cos(z.im)), n_mul(realMath.cosh(z.re), realMath.sin(z.im)));
    },
    cosh: function(z) {
      return new complex(n_mul(realMath.cosh(z.re), realMath.cos(z.im)), n_mul(realMath.sinh(z.re), realMath.sin(z.im)));
    },
    tanh: function(z) {
        return complexMath.sinh(z).div(complexMath.cosh(z));
    },
    asin: function(z) {
        return i.neg().mul( complexMath.log( i.mul(z).add( complexMath.sqrt( complex(I, O).sub(z.pow(two)) ) ) ) );
    },
    acos: function(z) {
        return i.neg().mul( complexMath.log( z.add( i.mul( complexMath.sqrt( complex(I, O).sub(z.pow(two)) ) ) ) ) );
    },
    atan: function(z) {
        return i.div(two).mul( complexMath.log( i.add(z).div(i.sub(z)) ) );
    },
    asinh: function(z) {
        return complexMath.log( z.add( complexMath.sqrt( z.pow(two).add(I) ) ) );
    },
    acosh: function(z) {
        return complexMath.log( z.add( complexMath.sqrt( z.pow(two).sub(I) ) ) );
    },
    atanh: function(z) {
        return complexMath.log( z.add(I).div(z.neg().add(I)) ).div(two);
    }
};
$_.complexMath = complexMath;
fn.complex = complex;

(['floor','ceil','round','fix','sign','exp','log','log10','log2','sin','cos','tan','sinh','cosh','tanh','asin','acos','atan','asinh','acosh','atanh']).forEach(function(f) {
    fn[f] = complexMath[f] ? function(x) {
        return apply(function(x) {
            return is_complex(x) ? complexMath[f](x) : realMath[f](x);
        }, x, true);
    } : function(x) {
        return apply(function(x) {
            return realMath[f](x);
        }, x, false);
    };
});
fn.atan2 = function(y, x) {
    return apply2(function(y, x) {
        return realMath.atan2(y, x);
    }, y, x, false);
};
fn.sqrt = function(x) {
    return apply(function(x) {
        return is_complex(x) ? complexMath.sqrt(x) : (n_gt(O, x) ? new complex(O, realMath.sqrt(n_neg(x))) : realMath.sqrt(x));
    }, x, true);
};
(['sqrt','pow','log']).forEach(function(f) {
    fn['real'+f] = function(x) {
        return apply(function(x) {
            x = realify(x);
            if (is_complex(x)) not_supported("real"+f);
            var y = realMath[f](x);
            return is_nan(y) || !is_real(y) ? not_supported("real"+f) : y;
        }, x, true);
    };
});
