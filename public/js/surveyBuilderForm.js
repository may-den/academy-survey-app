$(function() {
    var $addQuestionButton = $('#add-question')

    $addQuestionButton.prop("disabled", true)

    var $type = $('#input-selector')

    $type.change(function () { // attaching a listener for the question input type being changed

        //checking that it's being changed from the text input type to a non-text input type
        if ($('#question-options').length < 1 && $type.val() !== 'text-input') {
            addOptionsCreator($('#input-container')) // brings up the multiple choice options controls

        } else if ($type.val() == 'text-input') { // checking that it's being changed to the text input type
            $('#question-options').remove() //removes the multiple choice options controls
        }

        validateNewQuestion($('#question').val(), $addQuestionButton, $('#input-selector').val())
    })

    $('#question').keyup(function()
    {
        validateNewQuestion($('#question').val(), $addQuestionButton, $type.val())
    })

    //get new question information from form and adds question to question container div
    $addQuestionButton.click(function()
    {
        var $questionContainer = $('#question-container')
        var $typeOptions = $('#question-options')
        var $question = $('#question')
        var $type = $('#input-selector')
        var $required = $('#required')

        var question = $question.val()
        var type = $type.val().slice(0, $type.val().length - 6)
        var options = $typeOptions.find('.input-group input')

        if($required.is(':checked')){
            question += ' *'
        }

        var response = getNewQuestionResponse(type, options)

        addNewQuestion($questionContainer, question, response, $required)

        //resetting form
        $question.val('')
        $type.val('text-input')
        $required.prop('checked', false)
        $typeOptions.remove()
        $addQuestionButton.prop("disabled",true)
    })

})

//_________________________________FUNCTION DEFINITIONS__________________________________________

    /**
     * Adds the facility to add and remove options for multiple choice questions. Initially this consists of a text
     * field and an add option (+) button.
     *
     * @param $container OBJECT the created DOM objects are appended to the contents of this html element
     */
    function addOptionsCreator($container) {
        $container.append(
            '<div id="question-options">' +
            '<label for="option-text">Options:</label>' +
            '<div id="new-option-container" class="input-group col-xs-2">' +
            '<input type="text" id="option-text">' +
            '<button class="btn input-group-addon" id="add-option">+</button>' +
            '</div>' +
            '</div>'
        )

        createAddOptionHandler()
    }


    /**
     * Creates a handler for the click event on the add option button. The handler adds the option (providing it's
     * non-empty) to the list of options for that question.
     * Then validates the form.
     */
    function createAddOptionHandler() {
        $('#add-option').click(function () {
            if ($('#option-text').val() !== '') // disables an empty string being added as an option
            {
                createOption($('#new-option-container'))
            }

            validateNewQuestion($('#question').val(), $('#add-question'), $('#input-selector').val())
        })
    }


    /**
     * Creates a disabled field containing the text passed in, with a remove (-) button .
     *
     * @param $optionContainer OBJECT the div containing the text input and add button for creating new options
     */
    function createOption($optionContainer) {
        var $optionText = $optionContainer.find('input')
        $optionContainer.before(
            '<div class="input-group col-xs-2">' +
            '<input class="bg-success" value="' + $optionText.val() + '" disabled>' +
            '<button class="btn remove-option input-group-addon">-</button>' +
            '</div>'
        )
        $optionText.val('')

        $('.remove-option').click(function () {
            removeOption(this)
        })
    }


    /**
     * Removes the selected option from the list and then validates the form.
     *
     * @param currentOption OBJECT the remove button for the option to be removed
     */
    function removeOption(currentOption) {
        $(currentOption).parent('div').remove()
        validateNewQuestion($('#question').val(), $('#add-question'), $('#input-selector').val())
    }


    /**
     * Validates input of new question form
     * Enables button if all inputs valid
     *TODO put in the names of the parameters
     * TODO change the data type of the 2nd parameter as it's a jQuery object, which is itself a JS object
     * @param STRING question text in question's text box
     * @param JQUERYSELECTOR button to be enabled
     * @param $questionType OBJECT the input type currently selected in the dropdown menu
     */
    function validateNewQuestion(questionText, $button, $questionType) {

        var $removeOption = $('.remove-option')
        if (
            (
                (($questionType == 'radio-input') && ($removeOption.length >= 2)) ||
                (($questionType == 'checkbox-input') && ($removeOption.length >= 1)) ||
                ($questionType == 'text-input')
            ) &&
            questionText.length >= 10 &&
            questionText.length <= 255
        ) {
            $button.prop("disabled", false)
        }
        else {
            $button.prop("disabled", true)
        }
    }

/**
 * returns a string of the response input options based on the question type
 *
 * @param type STRING type of response
 * @param options ARRAY response options from the DOM
 *
 * @returns STRING html input(s) for question response
 */
function getNewQuestionResponse(type, options) {

    var response = '<div class="options">'

    if(type == 'text') {
        response += '<input type="text" disabled >'
    } else {
        options.each(function(key, option)
        {
            if($(this).prop('id') != 'option-text'){
                response += '<div><input type="' + type + '" disabled value="' + option.value + '"> ' + option.value + '</div>'
            }
        })
    }

    response += '</div>'

    return response
}

/**
 * creates question preview div using passed information and appends to container
 *
 * @param $container JQUERYSELECTOR container to append new question to
 * @param question STRING question text
 * @param response STRING html input(s) for question response
 * @param $required JQUERYSELECTOR required checkbox
 */
function addNewQuestion($container, question, response, $required) {

    var newQuestion =   '<div class="new-question ui-state-default">' +
        '<h5>' + question + '</h5>' +
        response +
        '<input type="submit" class="remove-question btn btn-sm" value="Remove">' +
        '</div>'

    var $newQuestion = $(newQuestion).data('required', $required.is(':checked'))

    $container.append($newQuestion)

    $container.sortable(
        {
            placeholder: "ui-state-highlight"
        }
    )

    createRemoveQuestionHandler()

}

/**
 * adds listener to remove question button
 */
function createRemoveQuestionHandler() {

    $('.remove-question').click(function()
    {
        $(this).parent('.new-question').remove()
    })

}