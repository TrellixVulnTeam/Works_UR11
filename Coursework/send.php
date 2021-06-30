<?php
$mailTo = 'crtdlunacy@gmail.com';
$mailFrom = 'crtdlunacy@gmail.com';
$successMsg = 'Сообщение отправлено!';
$fillMsg    = 'Пожалуйста, заполните все поля!';
$errorMsg   = 'Ошибка!';

?>
<?php
if(
    !isset($_POST['name']) ||
  !isset($_POST['phone']) ||
    empty($_POST['name']) ||
    empty($_POST['phone'])
) {
  $json_arr = array( "type" => "error", "msg" => $fillMsg );
  echo json_encode( $json_arr );
} else {

    ?>
    <?php
 
    
    $subject = "Заявка от пользователя";
  $msg = "Имя: ".$_POST['name']."\r\n";
  $msg .= "Телефон: ".$_POST['phone']."\r\n";	

    $success = @mail($mailTo, $subject ." " .$_POST['name'], $msg, 'From: ' . $mailFrom  );
  
    if ($success) {
    $json_arr = array( "type" => "success", "msg" => $successMsg );
    echo json_encode( $json_arr );
    } else {
    $json_arr = array( "type" => "error", "msg" => $errorMsg );
    echo json_encode( $json_arr );
    }
    

}