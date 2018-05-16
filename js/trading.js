/**
 * Created by Gergely on 11/13/2017.
 */

//Steam status

document.addEventListener("DOMContentLoaded", function() {refreshSteamStatus()});

document.getElementById("refreshstatus").onclick = function() {refreshSteamStatus()};

function refreshSteamStatus() {
    $.getJSON('https://api.enhancedsteam.com/steamapi/GetPlayerSummaries/?steamids=76561198036030455', function(json)
    {
        if(json.response.players[0].personastate===1||json.response.players[0].personastate===6)
        {
            $('#steamstatus').html("Online - At my pc, responding to offers and invites should be quick!");
        }
        else if(json.response.players[0].personastate===0)
        {
            $('#steamstatus').html("Offline - I am very likely sleeping or on vacation!");
        }
        else if(json.response.players[0].personastate===2)
        {
            $('#steamstatus').html("Busy - Busy means that I am probably studying or doing some kind of work that needs focusing. Responding to friend requests can be delayed, but I usually check offers every few minutes!");
        }
        else if(json.response.players[0].personastate===3||json.response.players[0].personastate===4)
        {
            $('#steamstatus').html("Away - I am away from keyboard at the moment, responding to offers and invites could take a few hours, but most likely under an hour!");
        }
        else if(json.response.players[0].personastate===5)
        {
            $('#steamstatus').html("Looking to Trade - I don't usually set to this status, but if I do I am definitely at my pc, responding to offers and invites should be quick!");
        }
        else
        {
            $('#steamstatus').html("Could not retrieve any information about the current profile status!");
        }
    });
}