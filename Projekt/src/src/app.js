"use strict";

var enterTAGment = {

    init: function(){
        enterTAGment.getResponse();
    },

    getResponse: function(option){
        $.ajax('instagramResponse.json')
            .done(function(data){
                enterTAGment.renderNumberOfTags(data.message);
            })
            .fail(function(){
                console.log("Ajax failed loading");
            });
    },

    renderNumberOfTags: function(tags){
        var div = document.createElement("div");
        div.innerHTML = tags;

        document.getElementsByName("body").app
    }
};
window.onload = enterTAGment.init;