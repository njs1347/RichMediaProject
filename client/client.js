"use strict";

$(document).ready(function() {
    //handle errors
    function handleError(message) {
        $("#errorMessage").text(message);
    }
    //json object
    function sendAjax(action, data) {
        $.ajax({
            cache: false,
            type: "POST",
            url: action,
            data: data,
            dataType: "json",
            success: function(result, status, xhr) {
                
                

                window.location = result.redirect;
            },
            //pops error when user enters in wrong data that doesnt match
            error: function(error) {
                $("#error").html("Username and password are not correct");
            }
        });        
    }
    //when signup button is clicked run through checks for the user and the password in the database
    $("#signupSubmit").on("click", function(e) {
        e.preventDefault();
    
        if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
            $("#errorSignup").html("Username and passswords do not match");
            return false;
        }
        
        if($("#pass").val() !== $("#pass2").val()) {
            $("#errorSignup").html("Passwords do not match");
            return false;           
        }

        sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());
        
        return false;
    });
    
    //when login button is clicked check for a user and their corresponding password, if not return false
    $("#loginSubmit").on("click", function(e) {
        e.preventDefault();
        
    
        if($("#user").val() == '' || $("#pass").val() == '') {
            return false;
        }
    
        sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());

        //return false;
    });
});