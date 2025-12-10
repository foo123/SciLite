function kron(x, y)
{
    var xrows, xcols, yrows, ycols;
    if (is_matrix(x))
    {
        if (is_matrix(y))
        {
            xrows = ROWS(x);
            xcols = COLS(x);
            yrows = ROWS(y);
            ycols = COLS(y);
            return matrix(xrows*yrows, xcols*ycols, function(i, j) {
                return mul(x[stdMath.floor(i / yrows)][stdMath.floor(j / ycols)], y[i % yrows][j % ycols]);
            });
        }
        else if (is_vector(y))
        {
            xrows = ROWS(x);
            xcols = COLS(x);
            yrows = 1;
            ycols = y.length;
            return matrix(xrows*yrows, xcols*ycols, function(i, j) {
                return mul(x[i][stdMath.floor(j / ycols)], y[j % ycols]);
            });
        }
    }
    else if (is_vector(x))
    {
        if (is_vector(y))
        {
            return matrix(x.length, y.length, function(i, j) {
                return mul(x[i], y[j]);
            });
        }
        else if (is_matrix(y))
        {
            xrows = x.length;
            xcols = 1;
            yrows = ROWS(y);
            ycols = COLS(y);
            return matrix(xrows*yrows, xcols*ycols, function(i, j) {
                return mul(x[stdMath.floor(i / yrows)], y[i % yrows][j % ycols]);
            });
        }
    }
    return mul(x, y);
}
fn.kron = kron;
