function dir_angle(x1, y1, x2, y2, x3, y3)
{
    // adapted from https://github.com/foo123/Geometrize
    var dx1 = n_sub(x1, x3),
        dx2 = n_sub(x2, x3),
        dy1 = n_sub(y1, y3),
        dy2 = n_sub(y2, y3)
    ;
    return n_sub(n_mul(dx1, dy2), n_mul(dy1, dx2));
}
function polar_angle(x1, y1, x2, y2)
{
    // adapted from https://github.com/foo123/Geometrize
    var a = realMath.atan2(n_sub(y2, y1), n_sub(x2, x1));
    return lt(a, O) ? n_add(a, 2*pi) : a;
}
function convex_hull_2d(x, y)
{
    // adapted from https://github.com/foo123/Geometrize
    var n = x.length, k = array(n, function(i) {return i;}),
        i0, i, convexHull, hullSize;

    // at least 3 points must define a non-trivial convex hull
    if (3 > n) return k;

    i0 = 0;
    for (i=1; i<n; ++i)
    {
        if (n_lt(y[i], y[i0]) || (n_eq(y[i], y[i0]) && n_lt(x[i], x[i0])))
        {
            i0 = i;
        }
    }
    k.splice(i0, 1);
    --n;

    k = k.map(function(i) {
        return [polar_angle(x[i0], y[i0], x[i], y[i]), i];
    }).sort(function(a, b) {
        return n_lt(a[0], b[0]) ? -1 : (n_gt(a[0], b[0]) ? 1 : 0);
    }).map(function(i) {
        return i[1];
    });

    // pre-allocate array to avoid slow array size changing ops inside loop
    convexHull = new Array(n + 1);
    convexHull[0] = i0;
    convexHull[1] = k[0];
    convexHull[2] = k[1];
    hullSize = 3;
    for (i=2; i<n; ++i)
    {
        while ((1 < hullSize) && n_le(O, dir_angle(x[k[i]], y[k[i]], x[convexHull[hullSize-1]], y[convexHull[hullSize-1]], x[convexHull[hullSize-2]], y[convexHull[hullSize-2]]))) --hullSize;
        convexHull[hullSize++] = k[i];
    }
    // truncate to actual size
    convexHull.length = hullSize;
    return convexHull;
}
fn.convhull = varargout(function(nargout, x, y, z) {
    if (3 < arguments.length) not_supported("convhull");
    if (is_matrix(x) && (2 === COLS(x)))
    {
        y = COL(x, 1);
        x = COL(x, 0);
    }
    else
    {
        x = vec(x);
        y = vec(y);
    }
    if (!is_vector(x) || !is_vector(y) || (x.length !== y.length)) not_supported("convhull");
    var hull2d = convex_hull_2d(x, y);
    return 1 < nargout ? [hull2d.map(function(i) {return i+1;}), polyarea(x, y)] : (hull2d.map(function(i) {return i+1;}));
});
