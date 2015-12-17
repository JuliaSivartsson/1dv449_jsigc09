"use strict";

var enterTAGment = {

    tags: ["supernatural", "doctorwho", "sherlock"],
    fileRoot: "response.json",

    init: function(){
        enterTAGment.getResponse();
    },

    getResponse: function(option){
        enterTAGment.tags.forEach(function(tag){
            $.ajax(tag + 'response.json')
                .done(function(data){
                    enterTAGment.renderNumberOfTags(data.data);
                })
                .fail(function(){
                    console.log("Ajax failed loading");
                });
        })
    },

    renderNumberOfTags: function(data){
        var dataText = "Tagname: " + data['name'] + ", number of images with this tag: " + data['media_count'];
        var div = document.createElement("div");
        div.innerHTML = dataText;

        var mainDiv = document.getElementById("main");
        mainDiv.appendChild(div);
    }
};
window.onload = enterTAGment.init;