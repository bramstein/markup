(function() {
    function getRepositories(num, callback) {
        $.ajax({
            url: 'https://api.github.com/users/bramstein/repos?callback=?',
            dataType: 'jsonp',
            success: function (resp) {
                var repositories = resp['data'];

                repositories.sort(function (a, b) {
                    if (a['pushed_at'] < b['pushed_at']) {
                        return 1;
                    } else if (b['pushed_at'] < a['pushed_at']) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
                callback(repositories.slice(0, num));
            },
            error: function () {
                callback([]);
            }
        });
    }

    function insertTracker() {
        window['_gaq'] = window['_gaq'] || [];
        window['_gaq'].push(['_setAccount', 'UA-10076742-1']);
        window['_gaq'].push(['_trackPageview']);

        var ga = document.createElement('script');

        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';

        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    }

    getRepositories(3, function (repositories) {
        var months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(/\s/),
            result = [];

        for (var i = 0; i < 3; i += 1) {
            var updated = new Date(repositories[i]['updated_at']);
            var updatedStr = months[updated.getUTCMonth()] + ' ' + updated.getUTCDate() + ', ' + updated.getUTCFullYear();

            result.push(
                '<li><p>' +
                    '<a href="' + encodeURI(repositories[i]['html_url']) + '">' +
                        repositories[i]['name'] +
                    '</a> ' +
                    updatedStr + ' ⋅ ' + repositories[i]['watchers'] + (repositories[i]['watchers'] === 1 ? ' watcher' : ' watchers') +
                '</p></li>'
            );
        }

        $('.last-updated').each(function() {
            $(this).html('<ul>' + result.join('') + '</ul>');
        });
    });

    insertTracker();
}());
