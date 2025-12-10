function nullspace(A, eps)
{
    // adapted from https://github.com/foo123/Abacus
    var columns, ref, pivots,
        free_vars, pl, tmp, LCM,
        O = __(0), I = __(1);

    columns = COLS(A);
    tmp = rref(A, true, null, eps);
    ref = tmp[0];
    pivots = tmp[1];
    pl = pivots.length;
    free_vars = pivots.reduce(function(c, p) {
        var i = 0;
        while ((i < c.length) && (p[1] > c[i])) ++i;
        if ((i < c.length) && (p[1] === c[i])) c.splice(i, 1);
        return c;
    }, array(columns, function(i) {return i;}));
    // exact integer rref, find LCM of pivots
    LCM = pl ? pivots.reduce(function(LCM, p, i) {
        return scalar_mul(LCM, ref[i][p[1]]);
    }, I) : I;
    return free_vars.map(function(free_var) {
        var p, g, i, vec = array(columns, function(j) {return j === free_var ? LCM : O;});
        for (p=0; p<pl; ++p)
        {
            i = pivots[p][1];
            if (i <= free_var)
            {
                // use exact (fraction-free) integer algorithm, which normalises rref NOT with 1 but with LCM of pivots
                vec[i] = scalar_sub(vec[i], scalar_mul(scalar_div(LCM, ref[p][i]), ref[p][free_var]));
            }
        }

        return vec; // column vector
    });
}
fn['null'] = function(x, tol) {
    return nullspace(x, tol);
};
