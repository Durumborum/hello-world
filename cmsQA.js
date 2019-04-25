var username = 'Simon';
var answer1;
var answer2;
var answer3;
var answer4;

// function to validate if loginOK is true or false. If false you are prompted to retry, else it removes loginbox and welcomes you back with your username.
var loginSuccess = function ( responseServer ) {
    $('#login + p').remove();
    if ( responseServer == true ) {
        $('<p>').html('Welcome back <b>' + username + '</b>!').addClass('welcomeText').appendTo('#loginBar')  
        $( '.container' ).removeClass('hide');
        $( '#loginBox').remove();
    } else {
        $('<p>').html('Username wrong, please try again').insertAfter('#login');
    }
}
//function to add error to text input fields
var addError = function(select) {
        if ( (select).val().length == 0 ) {
         (select).addClass('error');
    }
    }

//function to remove error on focus for text input fields
var focusRemoveError = function(select) {
    select.on('focus', function () {
        select.removeClass('error');
    })
}

// function to output all question and answer combinations
var outputAll = function( question ) {
    $('.question').remove();
    for ( var i = 0; i <= (question.length - 1); i++) {
        $('<div>').attr('id', 'question'+question[i].id).attr('data-qid',question[i].id).addClass('question border-bottom').appendTo('#displayAll');
        $( '<h3>' ).html('Question #' + question[i].id + ':').appendTo('#question'+question[i].id);
        $( '<h4>').html(question[i].text).appendTo('#question'+question[i].id);
            for (var a = 0; a <= (question[i].antworten.length - 1); a++) {
                //$( '<p>' ).attr('id', 'q'+(i+1)+'A'+(a+1)).html('Answer option ' + (a+1) + ': ' + question[i].antworten[a].text + ' - ' +question[i].antworten[a].richtig).appendTo('#question'+question[i].id);
                $( '<p>' ).attr('id', 'q'+(i+1)+'A'+(a+1)).html('#' + '<b>' + (a+1) + '</b>' + ': ' + question[i].antworten[a].text + ' ').appendTo('#question'+question[i].id);
                if (question[i].antworten[a].richtig == true) {
                    $( '<i>' ).addClass('fas fa-check').appendTo($('#q'+(i+1)+'A'+(a+1)));
                }
            }
            $('<div>').attr('id', 'editDelQuestionBox'+(i+1)).addClass('editDelQuestionBox').appendTo('#question'+question[i].id);
            $( '<button>').attr('id', 'editor'+question[i].id).attr('data-editid', question[i].id).addClass('editQA btn btn-outline-primary btn-sm').html('Edit question').appendTo('#editDelQuestionBox'+(i+1));
            $( '<button>').attr('id', 'deleter'+question[i].id).attr('data-delid', question[i].id).addClass('deleteQA btn btn-outline-secondary btn-sm').html('Delete question').appendTo('#editDelQuestionBox'+(i+1));
            $('#showAll').attr('disabled', true);
    }
}

// show all AJAX function
var showAllFunction = function() { 
    $.ajax({
        url:'http://wifi.1av.at/js/quizcms.php',
        method:'post',
        contentType: 'application/json',
        data:JSON.stringify({ 
            function: 'showAll',
            username: username,
        }),
        success:function( response ){
            var question = response.fragen;
            outputAll(question);
            },
            error:function() { console.log('Somethings wrong'); }
        })
    }

// delete all AJAX function
var deleteAllFunction = function (callback) {
    $.ajax({
        url:'http://wifi.1av.at/js/quizcms.php',
        method:'post',
        contentType: 'application/json',
        data:JSON.stringify({ 
            function: 'empty',
            username: username,
        }),
        success:function( response ){
            console.log(response.deleteAllOK);
            callback();
            }
        
        })
        
    }

    // function to delete individual question and answer blocks
    var deleteSingleFunction = function(ID, callback) {
        $.ajax({
        url:'http://wifi.1av.at/js/quizcms.php',
        method:'post',
        contentType: 'application/json',
        data:JSON.stringify({ 
            function: 'delete',
            username: 'Simon',
            id: ID,
        }),
        success:function( response ){
            console.log(response.deleteOK);
            callback()
            }
        })
        
    }

    //AJAX submit/save function
var submitQAFunction = function (callback) { 
    $.ajax({
            url:'http://wifi.1av.at/js/quizcms.php',
            method:'post',
            contentType: 'application/json',
            data:JSON.stringify({ 
                function: 'save',
                username: username,
                frage: $('#question').val(),
                antworten:[
                { text: $('#answer1').val(), richtig: answer1 }, 
                { text: $('#answer2').val(), richtig: answer2 },
                { text: $('#answer3').val(), richtig: answer3 },
                { text: $('#answer4').val(), richtig: answer4 }
                ]
            }),
            success:function( response ){
                console.log( response.saveOK );
                callback();
                },
            error:function( response ) { 
                console.log(response.saveOK); 
                }
            })
    }
    //submit edited question
var submitEditQAFunction = function (ID, callback) { 
    $.ajax({
            url:'http://wifi.1av.at/js/quizcms.php',
            method:'post',
            contentType: 'application/json',
            data:JSON.stringify({ 
                function: 'save',
                username: username,
                frage: $('#question').val(),
                id: ID,
                antworten:[
                { text: $('#answer1').val(), richtig: answer1 }, 
                { text: $('#answer2').val(), richtig: answer2 },
                { text: $('#answer3').val(), richtig: answer3 },
                { text: $('#answer4').val(), richtig: answer4 }
                ]
            }),
            success:function( response ){
                console.log( response.saveOK );
                callback();
                },
            error:function( response ) { 
                console.log(response.saveOK); 
                }
            })
    }

    //AJAX retrieve specific quesition function
var editQAFunction = function (ID, callback) { 
    $.ajax({
            url:'http://wifi.1av.at/js/quizcms.php',
            method:'post',
            contentType: 'application/json',
            data:JSON.stringify({ 
                function: 'show',
                username: username,
                id: ID,
            }),
            success:function( response ){
                console.log( response );
                var reply = response;
                console.log( reply.frage)
                console.log( reply.antworten[0])
                callback(reply);
                },
            error:function( response ) { 
                console.log(response); 
                }
            })
    }

$( document ).ready( function () { 
    $(this).scrollTop(0);

    //login function
    $ ( '#login' ).on( 'click', function(e) {
    e.preventDefault();
    $.ajax({
        url:'http://wifi.1av.at/js/quizcms.php',
        method:'post',
        contentType: 'application/json',
        data:JSON.stringify({ 
            function: 'login',
            username: $('#username').val() 
        }),
        success:function( response ){
            console.log(response.loginOK)
            username = 'Simon';
            loginSuccess(response.loginOK);
            }
        })
        
    });
    
    //simple functions to mark the 'true' answers via radio buttons in HTML form
    $('#a1').on('change', function () {
        answer1 = answer2 = answer3 = answer4 = false;
        answer1 = true;
    })
    
    $('#a2').on('change', function () {
        answer1 = answer2 = answer3 = answer4 = false;
        answer2 = true;
    })
    
    $('#a3').on('change', function () {
        answer1 = answer2 = answer3 = answer4 = false;
        answer3 = true;    
    })
    
    $('#a4').on('change', function () {
        answer1 = answer2 = answer3 = answer4 = false;
        answer4 = true;
    })

    // function to delete individual question and answer blocks
    $( '#displayAll' ).on( 'click', '.deleteQA', function(e) {
        e.preventDefault();
        var deleteConfirm = confirm('Are you sure you want to delete this entry?');
        if (deleteConfirm == true ) {
        deleteSingleFunction($(this).attr('data-delid'), function callback() {
                showAllFunction();
            })
        }
    });

    // function to submit question and associated answers to PHP
    $( '#submit' ).on( 'click', function(e) {
    e.preventDefault();
    
    // input validation, currently only validates string length longer than 0

    focusRemoveError($('#question'));
    addError($('#question'));

    focusRemoveError($('#answer1'));
    addError($('#answer1'));


    focusRemoveError($('#answer2'));
    addError($('#answer2'));

    
    focusRemoveError($('#answer3'));
    addError($('#answer3'));

    focusRemoveError($('#answer4'));
    addError($('#answer4'));


    $('#radioBox input').on('focus', function() {
        $( '#radioText' ).removeClass('errorTitle');	
    })
    if ( !$('#a1').is(':checked') && !$('#a2').is(':checked') && !$('#a3').is(':checked') && !$('#a4').is(':checked') )  {
        $( '#radioText' ).addClass('errorTitle');	
    }
    
    if ( $( '.error' )[0] || $( '.errorTitle' )[0] ) { //if any error classes are discovered, the error messsage below will be displayed, if no errors are found, the AJAX submit function is called. 
        $('#formErrorMsg').remove();
        $('<p>').attr('id','formErrorMsg').html('Please review errors and try again').insertAfter(this);
    } 
    else {
            submitQAFunction( function callback() {
                $("#qaForm")[0].reset();
                if( $('#displayAll .question')[0] ) { //this part needs a callback function?
                    showAllFunction();
                }
            }) 
            }
    });

    // function to delete all question and answer blocks
    $( '#manageContent' ).on( 'click', '#deleteAll', function(e) {
        e.preventDefault();
        var deleteAllConfirm = confirm('Are you sure you want to delete all entries?');
        if (deleteAllConfirm == true ) {
            deleteAllFunction( function callback() {
                $('#deleteAll').remove();
                $('#showAll').attr('disabled', false);
                showAllFunction();
                console.log('im being called!')
            })
        
            
        }
    });
    
    // Controls what happens when clicked on showAll button. Retrieves and displays all submitted questions and answers
    $( '#showAll' ).on( 'click', function(e) {
    e.preventDefault();
    $('#deleteAll').remove();
    $( '<button>').html('Delete all').addClass('btn btn-secondary').attr('id','deleteAll').insertAfter('#showAll');
    showAllFunction();
    });

    // Controls what happens when clicking on edit question button
    $( '#displayAll' ).on( 'click', '.editQA', function(e) {
    e.preventDefault();
    var questionID = $(this).attr('data-editid');
    $('#submit').remove();
    $('#submitEdit').remove();
    $('<button>').html('Submit edit').attr('id','submitEdit').attr('question-id', questionID).addClass('btn btn-primary').insertAfter('#radioBox')
    editQAFunction(questionID, function callback(reply) {
        $('#question').val(reply.frage)
        $('#answer1').val(reply.antworten[0])
        $('#answer2').val(reply.antworten[1])
        $('#answer3').val(reply.antworten[2])
        $('#answer4').val(reply.antworten[3])
        var correctVal = reply.richtig[0] + 1
        console.log(correctVal);
        $('#a' + correctVal).prop('checked', true);
    });

    $('#qaForm').on('click', '#submitEdit', function(e) {
        e.preventDefault();
        
        focusRemoveError($('#question'));
        addError($('#question'));

        focusRemoveError($('#answer1'));
        addError($('#answer1'));


        focusRemoveError($('#answer2'));
        addError($('#answer2'));

        focusRemoveError($('#answer3'));
        addError($('#answer3'));

        focusRemoveError($('#answer4'));
        addError($('#answer4'));

        $('#radioBox input').on('focus', function() {
            $( '#radioTitle' ).removeClass('errorTitle');	
        })
        if ( !$('#a1').is(':checked') && !$('#a2').is(':checked') && !$('#a3').is(':checked') && !$('#a4').is(':checked') )  {
            $( '#radioText' ).addClass('errorTitle');	
        }
        
        if ( $( '.error' )[0] || $( '.errorTitle' )[0] ) { //if any error classes are discovered, the error messsage below will be displayed, if no errors are found, the AJAX submit function is called. 
            $('#formErrorMsg').remove();
            $('<p>').attr('id','formErrorMsg').html('Please review errors and try again').insertAfter(this);
        } 
        else {
                submitEditQAFunction($(this).attr('question-id'), function callback() {
                    $("#qaForm")[0].reset();
                    $('#submitEdit').remove();
                    $('#submit').remove();
                    $('<button>').attr('id', 'submit').addClass('btn btn-primary').html('Submit').insertAfter('#radioBox')
                    if( $('#displayAll .question')[0] ) { 
                        showAllFunction();
                    }

                }) 
                }
        });
            console.log('seems to work!');
        })
    });