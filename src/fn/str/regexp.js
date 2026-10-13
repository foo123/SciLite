function create_regexp(pattern, flags)
{
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/RegExp
    flags = flags || '';
    return new RegExp(pattern, flags);
}
function regexp(str, expression, opts, ret)
{
    opts = opts || {};
    var re = create_regexp(expression, 'd' + Object.keys(opts).reduce(function(f, o) {
            if (opts[o] && (-1 < ['g','i','m','s'].indexOf(o))) f += o;
            return f;
        }, '')),
        m, matches = [];
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
                namedTokens: Object.keys((m.indices || []).groups || {}).map(function(name) {
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
    return null == ret ? matches : (ret.map(function(ret) {
        if ('start' === ret)
        {
            return matches.map(function(match) {
                return match.start+1;
            }));
        }
        else if ('end' === ret)
        {
            return matches.map(function(match) {
                return match.end+1;
            }));
        }
        else if ('tokenExtents' === ret)
        {
            return matches.reduce(function(ret, match) {
                ret.push.apply(ret, match.tokens.map(function(tok) {
                    return [tok.start+1, tok.end+1];
                }));
                return ret;
            }, []);
        }
        else if ('match' === ret)
        {
            return matches.map(function(match) {
                return match.match;
            });
        }
        else if ('tokens' === ret)
        {
            return matches.reduce(function(ret, match) {
                ret.push.apply(ret, match.tokens.map(function(tok) {
                    return tok.match;
                }));
                return ret;
            }, []);
        }
        else if ('names' === ret)
        {
            return matches.reduce(function(ret, match) {
                ret.push.apply(ret, match.namedTokens.map(function(tok) {
                    return [tok.name, tok.match];
                }));
                return ret;
            }, []);
        }
        else if ('split' === ret)
        {
            var start = 0;
            return matches.reduce(function(ret, match, n) {
                ret.push(str.slice(start, match.start));
                start = match.end;
                if (n+1 === matches.length) ret.push(str.slice(start));
                return ret;
            }, []);
        }
        return [];
    }));
}
fn.regexp = varargout(function(nargout, str, expression/*, ..args*/) {
    var ret = [], opts = {'g':1,'i':0,'m':0,'s':1,'emptymatch':0,'literalspacing':1,'warnings':0}, i, ans;
    for (i=3; i<arguments.length; ++i)
    {
        if ('start' === arguments[i])
        {
            ret.push('start');
        }
        else if ('end' === arguments[i])
        {
            ret.push('end');
        }
        else if ('tokenExtents' === arguments[i])
        {
            ret.push('tokenExtents');
        }
        else if ('match' === arguments[i])
        {
            ret.push('match');
        }
        else if ('tokens' === arguments[i])
        {
            ret.push('tokens');
        }
        else if ('names' === arguments[i])
        {
            ret.push('names');
        }
        else if ('split' === arguments[i])
        {
            ret.push('split');
        }
        else if ('all' === arguments[i])
        {
            opts['g'] = 1;
        }
        else if ('once' === arguments[i])
        {
            opts['g'] = 0;
        }
        else if ('ignorecase' === arguments[i])
        {
            opts['i'] = 1;
        }
        else if ('matchcase' === arguments[i])
        {
            opts['i'] = 0;
        }
        else if ('stringanchors' === arguments[i])
        {
            opts['m'] = 0;
        }
        else if ('lineanchors' === arguments[i])
        {
            opts['m'] = 1;
        }
        else if ('dotall' === arguments[i])
        {
            opts['s'] = 1;
        }
        else if ('dotexceptnewline' === arguments[i])
        {
            opts['s'] = 0;
        }
        else if ('noemptymatch' === arguments[i])
        {
            opts['emptymatch'] = 0;
        }
        else if ('emptymatch' === arguments[i])
        {
            opts['emptymatch'] = 1;
        }
        else if ('literalspacing' === arguments[i])
        {
            opts['literalspacing'] = 1;
        }
        else if ('freespacing' === arguments[i])
        {
            opts['literalspacing'] = 0;
        }
        else if ('nowarnings' === arguments[i])
        {
            opts['warnings'] = 0;
        }
        else if ('warnings' === arguments[i])
        {
            opts['warnings'] = 1;
        }
    }
    if (!ret.length) ret = ['start'];

    ans = regexp(str, expression, opts, ret);

    if (ans.length > nargout) ans.length = nargout;
    else if (ans.length < nargout) ans.push.apply(ans, array(nargout-ans.length, function() {return [];}));

    return 1 === nargout ? ans[0] : ans;
});
fn.regexpi = varargout(function(nargout, str, expression/*, ..args*/) {
    var ret = [], opts = {'g':1,'i':1,'m':0,'s':1,'emptymatch':0,'literalspacing':1,'warnings':0}, i, ans;
    for (i=3; i<arguments.length; ++i)
    {
        if ('start' === arguments[i])
        {
            ret.push('start');
        }
        else if ('end' === arguments[i])
        {
            ret.push('end');
        }
        else if ('tokenExtents' === arguments[i])
        {
            ret.push('tokenExtents');
        }
        else if ('match' === arguments[i])
        {
            ret.push('match');
        }
        else if ('tokens' === arguments[i])
        {
            ret.push('tokens');
        }
        else if ('names' === arguments[i])
        {
            ret.push('names');
        }
        else if ('split' === arguments[i])
        {
            ret.push('split');
        }
        else if ('all' === arguments[i])
        {
            opts['g'] = 1;
        }
        else if ('once' === arguments[i])
        {
            opts['g'] = 0;
        }
        else if ('ignorecase' === arguments[i])
        {
            opts['i'] = 1;
        }
        else if ('matchcase' === arguments[i])
        {
            opts['i'] = 0;
        }
        else if ('stringanchors' === arguments[i])
        {
            opts['m'] = 0;
        }
        else if ('lineanchors' === arguments[i])
        {
            opts['m'] = 1;
        }
        else if ('dotall' === arguments[i])
        {
            opts['s'] = 1;
        }
        else if ('dotexceptnewline' === arguments[i])
        {
            opts['s'] = 0;
        }
        else if ('noemptymatch' === arguments[i])
        {
            opts['emptymatch'] = 0;
        }
        else if ('emptymatch' === arguments[i])
        {
            opts['emptymatch'] = 1;
        }
        else if ('literalspacing' === arguments[i])
        {
            opts['literalspacing'] = 1;
        }
        else if ('freespacing' === arguments[i])
        {
            opts['literalspacing'] = 0;
        }
        else if ('nowarnings' === arguments[i])
        {
            opts['warnings'] = 0;
        }
        else if ('warnings' === arguments[i])
        {
            opts['warnings'] = 1;
        }
    }
    if (!ret.length) ret = ['start'];

    ans = regexp(str, expression, opts, ret);

    if (ans.length > nargout) ans.length = nargout;
    else if (ans.length < nargout) ans.push.apply(ans, array(nargout-ans.length, function() {return [];}));

    return 1 === nargout ? ans[0] : ans;
});