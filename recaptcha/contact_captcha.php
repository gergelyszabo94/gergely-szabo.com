<?php

require_once "recaptchalib.php";

// your secret key
$secret = "6LcA2vsSAAAAAJqyOzV-E7Bu0bz9MUorsZXw0qel";

// empty response
$response = null;

// check secret key
$reCaptcha = new ReCaptcha($secret);

// if submitted check response
if ($_POST["g-recaptcha-response"]) {
    $response = $reCaptcha->verifyResponse(
        $_SERVER["REMOTE_ADDR"],
        $_POST["g-recaptcha-response"]
    );
}
?>