function jade_real(X, m)
{
    /*
    "Blind beamforming for non Gaussian signals",
    Jean-Francois Cardoso and Antoine Souloumiac, 1993

    "High-order contrasts for independent component analysis",
    Jean-Francois Cardoso, 1999
    */
    // adapted from Cardoso's 2013 version of jadeR.m
    // https://www2.iap.fr/users/cardoso/compsep_classic.html
    // IN PROGRESS
}
function jade_complex(X, m)
{
    /*
    "Blind beamforming for non Gaussian signals",
    Jean-Francois Cardoso and Antoine Souloumiac, 1993

    "On the performance of orthogonal source separation algorithms",
    Jean-Francois Cardoso, 1994
    */
    // adapted from Cardoso's 2013 version of jade.m
    // https://www2.iap.fr/users/cardoso/compsep_classic.html
    // IN PROGRESS
}
fn.jade = function(X, m) {
    return fn.isreal(X) ? jade_real(fn.real(X), m) : jade_complex(complexify(X), m);
};
