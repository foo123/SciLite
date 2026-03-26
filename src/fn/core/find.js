function find(x, check)
{
    if (is_array(x))
    {
        if (is_array(x[0]))
        {
            if (is_array(x[0][0]))
            {
                // ndarray
                // use octave-compatible columnwise-ordering by permuting back and forth
                var sizex = size(x);
                return tensorview(x, {shape: sizex, ndarray: sizex}).permute(array(sizex.length, function(i) {return sizex.length-1-i;})).toArray().reduce(function(ind, xi, i) {
                    if (check(xi, i+1, 1)) ind.push(i+1);
                    return ind;
                }, []);
            }
            else
            {
                // matrix
                var rows = ROWS(x);
                return x.reduce(function(ind, xi, i) {
                    return xi.reduce(function(ind, xij, j) {
                        if (check(xij, i+1, j+1)) ind.push(i+rows*j+1);
                        return ind;
                    }, ind);
                }, []);
            }
        }
        else
        {
            // vector
            return x.reduce(function(ind, xi, i) {
                if (check(xi, i+1, 1)) ind.push(i+1);
                return ind;
            }, []);
        }
    }
    return [];
}
$_.find = find;
fn.find = function(x) {
    return find(x, function(x) {return !eq(x, O);});
};
