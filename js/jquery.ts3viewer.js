(function ($) {
    $.fn.tsviewer = function (options) {
        $.fn.tsviewer.element = this;
        $.fn.tsviewer.options = $.extend({}, $.fn.tsviewer.options, options);
        $.fn.tsviewer.init();
        $.fn.tsviewer.hook();
    };
    $.fn.tsviewer.element = null;
    $.fn.tsviewer.options = {
        host: null,
        port: null,
        iconUrl: 'https://api.planetteamspeak.com/servericon/$host:$port/?id=$icon&amp;img=1',
        dataUrl: 'https://api.planetteamspeak.com/servernodes/$host:$port/',
        serverTip: '',
        channelTip: '',
        clientTip: '',
        onNode: function () {
        },
        onReady: function () {
        },
        onError: function () {
        }
    };
    $.fn.tsviewer.init = function () {
        $.fn.tsviewer.element.html('<ul id="tsv-container-ts3" class="tsv-container"></ul>');
        $.fn.tsviewer.options.iconUrl = $.fn.tsviewer.options.iconUrl.replace('$host', $.fn.tsviewer.options.host).replace('$port', $.fn.tsviewer.options.port);
        $.fn.tsviewer.options.dataUrl = $.fn.tsviewer.options.dataUrl.replace('$host', $.fn.tsviewer.options.host).replace('$port', $.fn.tsviewer.options.port);
        $.fn.tsviewer.refresh(true);
    };
    $.fn.tsviewer.refresh = function (loader) {
        var req = $.ajax($.fn.tsviewer.options.dataUrl);
        if (loader === true) {
            $('#tsv-container-ts3').html('<li id="tsv-node-loader" class="tsv-node loader"><div class="tsv-icon tsv-loader"></div><span class="tsv-name">Loading ...</span></li>');
        }
        req.done(function (json, status, request) {
            if (json.status !== 'success' || !$.isArray(json.result.data)) {
                return $.fn.tsviewer.error(request, json.result.message);
            }
            $('#tsv-container-ts3').html('');
            for (var i = 0; i < json.result.data.length; i++) {
                $.fn.tsviewer.render(json.result.data[i], i);
            }
            $.fn.tsviewer.options.onReady.call(this, json.result.data, i);
        });
        req.fail(function (request, status, error) {
            return $.fn.tsviewer.error(request, 'failed to retrieve tsviewer data');
        });
    };
    $.fn.tsviewer.expand = function () {
        $.fn.tsviewer.element.find('.tsv-sibling.collapsed').each(function () {
            $(this).parents('.tsv-wrapper').siblings('ul').show();
            $(this).toggleClass('expanded');
            $(this).toggleClass('collapsed');
        });
    };
    $.fn.tsviewer.collapse = function () {
        $.fn.tsviewer.element.find('.tsv-sibling.expanded').each(function () {
            $(this).parents('.tsv-wrapper').siblings('ul').hide();
            $(this).toggleClass('expanded');
            $(this).toggleClass('collapsed');
        });
    };
    $.fn.tsviewer.hook = function () {
        $.fn.tsviewer.element.on('click', '.tsv-sibling.expanded, .tsv-sibling.collapsed', function () {
            $(this).parents('.tsv-wrapper').siblings('ul').toggle();
            $(this).toggleClass('expanded');
            $(this).toggleClass('collapsed');
        });
    };
    $.fn.tsviewer.render = function (node, num) {
        if (node.class === 'channel' && node.props.flags & 0x80) {
            node.class = 'spacer ' + node.props.spacer.replace('custom', '');
            if (node.props.spacer.substr(0, 6) !== 'custom') {
                node.name = '';
            }
            else if (node.name.length && node.props.spacer.substr(node.props.spacer.length - 6) === 'repeat') {
                while (node.name.length < 256) {
                    node.name += node.name;
                }
            }
        }
        var object = $('<li id="tsv-node-' + node.ident + '" class="tsv-node ' + node.class + ' tsv-' + (num % 2 ? 'row2' : 'row1') + '" data-id="' + node.props.id + '"></li>');
        $('#tsv-container-' + node.parent).append(object);
        var wrapper = $('<div class="tsv-wrapper"></div>');
        var nodebox = $('<div class="tsv-' + node.class + '"></div>');
        var infobox = $('<div class="tsv-infos"></div>');
        var iconbox = $('<div class="tsv-icons"></div>');
        var tooltip = '';
        object.append(wrapper);
        object.append('<div class="tsv-clear"></div>');
        wrapper.append(nodebox);
        nodebox.append(infobox);
        nodebox.append(iconbox);
        for (var i = 0; i < node.siblings.length; i++) {
            infobox.append('<div class="tsv-sibling ' + (node.siblings[i] ? 'tsv-sibling-line' : 'tsv-sibling-blank') + '"></div>');
        }
        if (node.level > 1) {
            infobox.append('<div class="tsv-sibling ' + (node.last ? 'tsv-sibling-end' : 'tsv-sibling-mid') + (node.children > 0 ? ' expanded' : '') + '"></div>');
        }
        if (node.class.substr(0, 6) !== 'spacer') {
            if (node.class === 'channel' && node.props.flags & 0x40) {
                node.image += '-subscribed';
            }
            infobox.append('<div class="tsv-icon tsv-' + node.image + '"></div>');
        }
        if (node.class === 'server') {
            tooltip += $.fn.tsviewer.options.serverTip;
        }
        else if (node.class === 'channel') {
            if (node.props.flags & 0x01) iconbox.append('<div class="tsv-icon tsv-channel-flag-default" title="Default Channel"></div>');
            if (node.props.flags & 0x02) iconbox.append('<div class="tsv-icon tsv-channel-flag-password" title="Password-protected"></div>');
            if (node.props.flags & 0x10) iconbox.append('<div class="tsv-icon tsv-channel-flag-music" title="Music Codec"></div>');
            if (node.props.flags & 0x20) iconbox.append('<div class="tsv-icon tsv-channel-flag-moderated" title="Moderated"></div>');
            node.props.codec = $.fn.tsviewer.codec(node.props.codec);
            tooltip += $.fn.tsviewer.options.channelTip;
        }
        else if (node.class === 'client') {
            if (node.props.flags & 0x08) iconbox.append('<div class="tsv-icon tsv-client-priority" title="Priority Speaker"></div>');
            if (node.props.flags & 0x04) iconbox.append('<div class="tsv-icon tsv-client-cc" title="Channel Commander"></div>');
            if (node.props.flags & 0x10) iconbox.append('<div class="tsv-icon tsv-client-talker" title="Talk Power granted"></div>');
            if (node.props.flags & 0x20) iconbox.append('<div class="tsv-icon tsv-client-mic-muted" title="Insufficient Talk Power"></div>');
            for (var i = 0; i < node.props.memberof.length; i++) {
                iconbox.append($.fn.tsviewer.icon(node.props.memberof[i].icon, $('<div />').text(node.props.memberof[i].name).html() + ' [' + (node.props.memberof[i].flags & 32 ? 'Server' : 'Channel') + ' Group]'));
            }
            tooltip += $.fn.tsviewer.options.clientTip;
        }
        if (tooltip.length) {
            for (var prop in node.props) {
                tooltip = tooltip.replace('$' + prop, node.props[prop]);
            }
        }
        iconbox.append($.fn.tsviewer.icon(node.props.icon, node.class.charAt(0).toUpperCase() + node.class.slice(1) + ' Icon'));
        infobox.append('<span class="tsv-name"' + (tooltip.length ? ' title="' + tooltip + '"' : '') + '>' + (node.name ? $('<div />').text(node.name).html() : '&nbsp;') + '</span>');
        $.fn.tsviewer.width(nodebox, iconbox);
        $.fn.tsviewer.options.onNode.call(this, object, node);
        if (node.children > 0) {
            object.append('<ul id="tsv-container-' + node.ident + '" class="tsv-container"></ul>');
        }
    };
    $.fn.tsviewer.base = function () {
    };
    $.fn.tsviewer.icon = function (id, title) {
        if (id > 0) {
            if (id < 1000) {
                return '<div class="tsv-icon tsv-group-' + id + '" title="' + title + '"></div>';
            }
            else {
                return '<div class="tsv-icon" style="background: url(\'' + $.fn.tsviewer.options.iconUrl.replace('$icon', id) + '\') 0 0/contain no-repeat" title="' + title + '"></div>';
            }
        }
        return '';
    };
    $.fn.tsviewer.codec = function (codec) {
        if (codec === 0x00)return 'Speex Narrowband';
        if (codec === 0x01)return 'Speex Wideband';
        if (codec === 0x02)return 'Speex Ultra-Wideband';
        if (codec === 0x03)return 'CELT Mono';
        if (codec === 0x04)return 'Opus Voice';
        if (codec === 0x05)return 'Opus Music';
        return codec;
    };
    $.fn.tsviewer.width = function (nodebox, iconbox) {
        var width = iconbox.width();
        nodebox.css({marginRight: width});
        iconbox.css({marginRight: -width, width: width});
    };
    $.fn.tsviewer.error = function (request, error) {
        $.fn.tsviewer.options.onError.call(this, error);
        $('#tsv-container-ts3').html('<li id="tsv-node-error" class="tsv-node error"><div class="tsv-icon tsv-error" title="ERROR, ' + error.toLowerCase() + '"></div><span class="tsv-name">' + $.fn.tsviewer.options.host + ':' + $.fn.tsviewer.options.port + '</span></li>');
    };
    $.fn.tsviewerRefresh = function (loader) {
        if ($.fn.tsviewer.element) {
            $.fn.tsviewer.refresh(loader);
        }
    };
    $.fn.tsviewerExpand = function () {
        if ($.fn.tsviewer.element) {
            $.fn.tsviewer.expand();
        }
    };
    $.fn.tsviewerCollapse = function () {
        if ($.fn.tsviewer.element) {
            $.fn.tsviewer.collapse();
        }
    };
}(jQuery));