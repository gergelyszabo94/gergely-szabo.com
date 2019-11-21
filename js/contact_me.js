const form = document.getElementById('contactForm');
const url = 'https://siteapi.gergely-szabo.com/email/send';
const submit = document.getElementById('sendMessageButton');

$(function() {

  $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
    preventSubmit: true,
    submitSuccess: function($form, event) {
      event.preventDefault(); // prevent default submit behaviour

      $this = $("#sendMessageButton");
      $this.prop("disabled", true); // Disable submit button until AJAX call is complete to prevent duplicate messages

        const payload = {
            name: $("input#name").val(),
            email: $("input#email").val(),
            content: $("textarea#message").val(),
            hCaptcha: $("#hcaptcha").find($("iframe")).attr('data-hcaptcha-response')
        };

        let req = new XMLHttpRequest();
        req.open("POST", url, true);
        req.setRequestHeader("Content-Type", "application/json");
        req.addEventListener("load",  (event) => {
            if (req.status < 400) success();
            else error(JSON.parse(req.responseText));
        });
        req.send(JSON.stringify(payload));

        setTimeout(function() {
            $this.prop("disabled", false); // Re-enable submit button when AJAX call is complete
        }, 1000);

    },
    filter: function() {
      return $(this).is(":visible");
    },
  });

  $("a[data-toggle=\"tab\"]").click(function(e) {
    e.preventDefault();
    $(this).tab("show");
  });
});

/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
  $('#success').html('');
});

function success () {
    // Success message
    $('#success').html("<div class='alert alert-success'>");
    $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
        .append("</button>");
    $('#success > .alert-success')
        .append("<strong>Your message has been sent. </strong>");
    $('#success > .alert-success')
        .append('</div>');
    //clear all fields
    $('#contactForm').trigger("reset");
}

function error (err) {
    let errorMessage = 'Sorry, something went wrong. Please try again later or try to reach me another way!';
    if (err === 'Captcha token missing') errorMessage = 'Please complete the captcha before clicking send!';
    if (err === 'Could not verify hCaptcha') errorMessage = 'Could not verify that you have completed the captcha. Please complete it before clicking send!';
    // Fail message
    $('#success').html("<div class='alert alert-danger'>");
    $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
        .append("</button>");
    $('#success > .alert-danger').append($("<strong>").text(errorMessage));
    $('#success > .alert-danger').append('</div>');
    //clear all fields
    $('#contactForm').trigger("reset");
}