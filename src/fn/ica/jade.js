// TODO
function jade_r()
{
}
function jade()
{
}
fn.jade = function(A) {
    return fn.isreal(A) ? jade_r(fn.real(A)) : jade(complexify(A));
};
