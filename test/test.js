var chai = require('chai');
var expect = chai.expect;
var $ = require('jquery');

describe('App', function () {
    it('should set the background color', function () {
        var div = $('<div></div>').css('background-color','green');
        $('body').append(div);
        //var div = document.createElement('div');
        //div.style.background = "green";

        console.log($('body').html());
        expect($('body').children.length).to.equal(1);

    });
});