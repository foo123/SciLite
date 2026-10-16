function create_regexp(expression, opts)
{
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/RegExp
    opts = opts || {};
    return new RegExp(expression, KEYS(opts).reduce(function(f, o) {
        if (opts[o] && (-1 < ['g','i','m','s'].indexOf(o))) f += o;
        return f;
    }, 'd'));
}
function apply_regexp(str, re, opts)
{
    // TODO support dynamic regular expressions
    opts = opts || {};
    re.lastIndex = 0; // reset, just in case
    var m, matches = [];
    while (null !== (m=re.exec(str)))
    {
        if (m[0].length || opts['emptymatch'])
        {
            matches.push({
                match:  m[0],
                start:  m.index,
                end:    m.index + m[0].length,
                tokens: (m.indices || []).slice(1).map(function(ind, i) {
                    return {
                        match:  m[i+1],
                        start:  ind[0],
                        end:    ind[1],
                        name:   null
                    };
                }),
                namedTokens: KEYS((m.indices || []).groups || {}).map(function(name) {
                    var ind = m.indices.groups[name];
                    return {
                        match:  str.slice(ind[0], ind[1]),
                        start:  ind[0],
                        end:    ind[1],
                        name:   name
                    };
                })
            });
            if (!m[0].length) ++re.lastIndex;
            else if (!opts['g']) break;
        }
    }
    return matches;
}
function regexp_ret(i, args, opts)
{
    opts = opts || {};
    var n = args.length, ret = [];
    for (i=i||0; i<n; ++i)
    {
        if ('start' === args[i])
        {
            ret.push('start');
        }
        else if ('end' === args[i])
        {
            ret.push('end');
        }
        else if ('tokenExtents' === args[i])
        {
            ret.push('tokenExtents');
        }
        else if ('match' === args[i])
        {
            ret.push('match');
        }
        else if ('tokens' === args[i])
        {
            ret.push('tokens');
        }
        else if ('names' === args[i])
        {
            ret.push('names');
        }
        else if ('split' === args[i])
        {
            ret.push('split');
        }
        else if ('all' === args[i])
        {
            opts['g'] = 1;
        }
        else if ('once' === args[i])
        {
            opts['g'] = 0;
        }
        else if ('ignorecase' === args[i])
        {
            opts['i'] = 1;
        }
        else if ('matchcase' === args[i])
        {
            opts['i'] = 0;
        }
        else if ('stringanchors' === args[i])
        {
            opts['m'] = 0;
        }
        else if ('lineanchors' === args[i])
        {
            opts['m'] = 1;
        }
        else if ('dotall' === args[i])
        {
            opts['s'] = 1;
        }
        else if ('dotexceptnewline' === args[i])
        {
            opts['s'] = 0;
        }
        else if ('noemptymatch' === args[i])
        {
            opts['emptymatch'] = 0;
        }
        else if ('emptymatch' === args[i])
        {
            opts['emptymatch'] = 1;
        }
        else if ('literalspacing' === args[i])
        {
            opts['literalspacing'] = 1;
        }
        else if ('freespacing' === args[i])
        {
            opts['literalspacing'] = 0;
        }
        else if ('nowarnings' === args[i])
        {
            opts['warnings'] = 0;
        }
        else if ('warnings' === args[i])
        {
            opts['warnings'] = 1;
        }
    }
    if (!ret.length) ret = ['start'];
    return ret;
}
function regexp(str, expression, ret, opts, nargout)
{
    nargout = nargout || 1;
    var matches = apply_regexp(str, create_regexp(expression, opts), opts),
        ans = ret.map(function(r) {
            var ret = [], start = 0;
            if ('start' === r)
            {
                ret = matches.map(function(match) {
                    return match.start+1;
                });
            }
            else if ('end' === r)
            {
                ret = matches.map(function(match) {
                    return match.end+1;
                });
            }
            else if ('tokenExtents' === r)
            {
                ret = matches.reduce(function(ret, match) {
                    ret.push.apply(ret, match.tokens.map(function(tok) {
                        return [tok.start+1, tok.end+1];
                    }));
                    return ret;
                }, []);
            }
            else if ('match' === r)
            {
                ret = matches.map(function(match) {
                    return match.match;
                });
            }
            else if ('tokens' === r)
            {
                ret = matches.reduce(function(ret, match) {
                    ret.push.apply(ret, match.tokens.map(function(tok) {
                        return tok.match;
                    }));
                    return ret;
                }, []);
            }
            else if ('names' === r)
            {
                ret = matches.reduce(function(ret, match) {
                    ret.push.apply(ret, match.namedTokens.map(function(tok) {
                        return [tok.name, tok.match];
                    }));
                    return ret;
                }, []);
                ret = cellarray(ret, ret.length ? [ret.length, 2] : [0, 0]);
            }
            else if ('split' === r)
            {
                ret = matches.reduce(function(ret, match, index) {
                    ret.push(str.slice(start, match.start));
                    start = match.end;
                    if (index+1 === matches.length) ret.push(str.slice(start));
                    return ret;
                }, []);
            }
            return ret;
        })
    ;

    if (ans.length > nargout) ans.length = nargout;
    else if (ans.length < nargout) ans.push.apply(ans, array(nargout-ans.length, function() {return [];}));

    return 1 === nargout ? ans[0] : ans;
}
fn.regexp = varargout(function(nargout, str, expression/*, ..args*/) {
    var opts = {'g':1,'i':0,'m':0,'s':1,'emptymatch':0,'literalspacing':1,'warnings':0},
        ret = regexp_ret(3, arguments, opts);
    return apply_(function(str, expression) {return regexp(str, expression, ret, opts, nargout);}, [str, expression], null, nargout);
});
fn.regexpi = varargout(function(nargout, str, expression/*, ..args*/) {
    var opts = {'g':1,'i':1,'m':0,'s':1,'emptymatch':0,'literalspacing':1,'warnings':0},
        ret = regexp_ret(3, arguments, opts);
    return apply_(function(str, expression) {return regexp(str, expression, ret, opts, nargout);}, [str, expression], null, nargout);
});