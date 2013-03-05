var assert = require('assert');
var Browser = require('zombie');
var browser = new Browser();

describe('Loads pages', function(){
    it('home page', function(){
        browser.visit("http://localhost:3000/", function () {
            assert.equal(browser.text("title"), 'Home Page');
        });
    });
    it('login page', function(){
        browser.visit("http://localhost:3000/login", function () {
            assert.equal(browser.text("title"), 'Login Page');
        });
    });
    it('signup page', function(){
        browser.visit("http://localhost:3000/signup", function () {
            assert.equal(browser.text("title"), 'Sign Up Page');
        });
    });
});