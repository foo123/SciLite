function find(x, check)
{
    if (is_vector(x))
    {
        return x.reduce(function(ind, xi, i) {
            if (check(xi, i+1, 1)) ind.push(i+1);
            return ind;
        }, []);
    }
    else if (is_matrix(x))
    {
        var rows = ROWS(x);
        return x.reduce(function(ind, xi, i) {
            return xi.reduce(function(ind, xij, j) {
                if (check(xij, i+1, j+1)) ind.push(i+rows*j+1);
                return ind;
            }, ind);
        }, []);
    }
    return [];
}
$_.find = find;
fn.find = function(x) {
    return find(x, function(x) {return !eq(x, O);});
};
