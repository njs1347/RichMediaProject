"use strict";

$(document).ready(function() {

    function handleError(message) {
        $("#errorMessage").text(message);
    }
    
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
            error: function(error) {
                $("#error").html("Username and password are not correct");
            }
        });        
    }
    
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

    $("#loginSubmit").on("click", function(e) {
        e.preventDefault();
        
    
        if($("#user").val() == '' || $("#pass").val() == '') {
            return false;
        }
    
        sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());

        //return false;
    });
});