fn.hankel = function(c, r) {
    var m, n, p;
    if (1 === arguments.length)
    {
        c = vec(c);
        m = c.length;
        return matrix(m, m, function(i, j) {
            return j > m-1-i ? O : c[(i+j) % m];
        });
    }
    else
    {
        c = vec(c);
        r = vec(r);
        m = c.length;
        n = r.length;
        //p = c.concat(r.slice(1));
        return matrix(n, n, function(i, j) {
            return i+j-1 >= m ? r[i+j - m] : c[(i+j) % m];//p[i+j-1];
        });
    }
};