/**
 * Created by Gergely on 9/19/2017.
 */


//Server Status
$.getJSON('https://api.planetteamspeak.com/serverstatus/gergely-szabo.com/', function(json)
{
    if(json.status == 'success')
    {
        $('#name').html(json.result.name);

        // check status
        if(json.result.online)
        {
            $('#status').html('Online');
        }
        else
        {
            $('#status').html('Offline');
        }

        $('#users').html(json.result.users + ' / ' + json.result.slots);

        if(json.result.password)
        {
            $('#password').html('Yes');
        }
        else
        {
            $('#password').html('No');
        }

        if(json.result.createchannels)
        {
            $('#createchannels').html('Anyone');
        }
        else
        {
            $('#createchannels').html('Admins only');
        }
    }
    else
    {
        $('#status').html(json.result.message);
    }
});


// Server History
$.getJSON('https://api.planetteamspeak.com/serverhistory/gergely-szabo.com/?duration=2', function(json)
{
    if(json.status == 'success')
    {
        var onl = [];
        var off = [];

        for(var key in json.result.data)
        {
            var time = (moment(key).unix())*1000;

            if(json.result.data[key] !== -1)
            {
                onl[onl.length] = [time, json.result.data[key]];
                off[off.length] = [time, null];
            }
            else
            {
                onl[onl.length] = [time, 0];
                off[off.length] = [time, 0];
            }
        }

        $('#history').highcharts({
            chart: {
                backgroundColor: '#2C3E50',
                borderColor: '#FFFFFF',
                borderWidth: 0,
                type: 'line',
                style: {
                    titleColor:'#FFFFFF'
                }
            },
            title: {
                text: 'Clients Online last 48 Hours',
                style: {
                    color: '#FFFFFF',
                }
            },
            subtitle: {
                text: null
            },
            legend: {
                enabled: false
            },
            tooltip: {
                shared:    false,
                formatter: function()
                {
                    if(this.series.name === 'No Data')
                    {
                        return '<b>No Usage Data Available</b><br />Either the TS3 Server was offline or did not report<br />to the master server at this time.';
                    }
                    else
                    {
                        return '<b>' + Highcharts.dateFormat('%a, %d %b %Y %H:%M', this.x) + ' UTC</b><br />Users Online: ' + Highcharts.numberFormat(this.y, 0);
                    }
                }
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: null
                },
                labels: {
                    style: {
                        color: '#FFFFFF',
                    }
                }
            },
            yAxis: {
                title: {
                    text: 'Users Online',
                    style: {
                        color: '#FFFFFF',
                    }
                },
                gridLineColor: '#FFFFFF',
                gridLineWidth: 0.5,
                lineColor: '#FFFFFF',
                lineWidth: 0.5,
                max: 32,
                labels: {
                    style: {
                        color: '#FFFFFF',
                    }
                }

            },
            plotOptions: {
              series:{
                  color: '#71BCCE'
              }
            },
            series: [{
                type:      'area',
                name:      'Users Online',
                data:      onl
            },{
                type:      'area',
                name:      'No Data',
                data:      off
            }]
        });
    }
    else
    {
        $('#history').html('<span class="text-danger">' + json.result.message + '</span>');
    }
});


//Live Channel/Users Preview

$( document ).ready(function() {
    $('#tsviewer').tsviewer({
        // mandatory server address
        host: "gergely-szabo.com",
        port: "9987",
        // optional tooltip patterns
        serverTip:  "Clients: $users/$slots",
        channelTip: "Codec: $codec",
        clientTip:  "Version: $version on $platform",
        // optional callbacks
        onNode:  function(elem, node) {
            // your code
        },
        onReady: function(data, count) {
            // your code
        },
        onError: function(error) {
            // your code
        }
    });

    $('#refresh').click(function() {
        // shortcut to refresh the tree
        $('#tsviewer').tsviewerRefresh(true);
    });

    $('#expand').click(function() {
        // shortcut to expand all nodes
        $('#tsviewer').tsviewerExpand();
    });

    $('#collapse').click(function() {
        // shortcut to collapse all nodes
        $('#tsviewer').tsviewerCollapse();
    });
});


