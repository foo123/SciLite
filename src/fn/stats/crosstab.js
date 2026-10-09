function chi2_contingency(observed)
{
    var sz = !is_array(observed) ? [1] : (is_1d(observed) ? [observed.length] : size(observed)),
        dof = n_add(n_sub(prod(sz), sum(sz)), sz.length-1),
        sums, expected = null, stat, p = null;
    if (n_eq(dof, O))
    {
        stat = O;
        p = I;
    }
    else
    {
        sums = array(sz.length, function(dim) {
            var sumaxes = sum(
                observed,
                array(sz.length-1, function(axis) {
                    return axis < dim ? (axis+1) : (axis+2);
                })
            );
            return ndarray(sz.slice(), function(index) {return sumaxes[index[dim]];});
        });
        expected = dotdiv(sums.slice(1).reduce(function(r, s) {
            return dotmul(r, s);
        }, sums[0]), scalar_pow(sum(observed, "all"), sz.length-1));
        // Pearson's chi-squared statistic
        stat = sum(dotdiv(dotpow(sub(observed, expected), 2), expected), "all");
        p = n_sub(I, chi2cdf(stat, dof)); // accuracy at least 1-2 decimal points
    }
    return {
        stat: stat,
        p: p,
        dof: dof,
        expected: expected
    };
}
function crosstab(args, nargout)
{
    nargout = nargout || 1;
    args = args.map(function(arg) {return is_array(arg) ? colon(arg) : [arg];});
    if (args.length !== args.filter(function(arg) {return args[0].length === arg.length;}).length) throw "crosstab: inputs not of same length";
    var labels = cellarray(array(args.length, function(i) {
            return sort(args[i].reduce(function(_, v) {
                var k = String(v);
                if (!HAS.call(_.h, k))
                {
                    _.h[k] = 1;
                    _.v.push(v);
                }
                return _;
            }, {h:{},v:[]}).v);
        }), [args.length]),
        arg0 = args[0],
        tab = ndarray(labels.map(function(values) {return values.length;}), function(i) {
            return arg0.reduce(function(s, _, j) {
                for (var found=0,k=0,n=i.length; k<n; ++k)
                {
                    if (String(labels[k][i[k]]) !== String(args[k][j])) break;
                    ++found;
                }
                if (n === found) ++s;
                return s;
            }, 0);
        }),
        chi2 = 1 < nargout ? chi2_contingency(tab) : {stat:null, p:null}
    ;
    return 1 < nargout ? [tab, chi2.stat, chi2.p, labels] : tab;
}
fn.crosstab = varargout(function(nargout /*..args*/) {
    return crosstab([].slice.call(arguments, 1), nargout);
});
fn.chi2contingency = varargout(function(nargout, table) {
    var chi2 = chi2_contingency(table);
    return 1 < nargout ? [chi2.stat, chi2.p, chi2.dof, chi2.expected] : chi2.stat;
});