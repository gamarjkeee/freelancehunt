<?php
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\SMTP;
	use PHPMailer\PHPMailer\Exception;

	require 'phpmailer/src/Exception.php';
	require 'phpmailer/src/PHPMailer.php';
	require 'phpmailer/src/SMTP.php';

	$mail = new PHPMailer(true);
	$mail->CharSet = 'UTF-8';
	$mail->setLanguage('en', 'phpmailer/language/');
	$mail->IsHTML(true);

	$mail->isSMTP(); //Send using SMTP
	$mail->Host = 'smtp.gmail.com'; //Set the SMTP server to send through
	$mail->SMTPAuth = true; //Enable SMTP authentication
	$mail->Username = 'musienko.work@gmail.com'; //SMTP username (email)
	$mail->Password = 'vffhmmzbdfyyfubub69'; //SMTP password (email password)
	$mail->Port = '587';
	$mail->SMTPSecure = 'TLS';

	//From SMTP username (email)
	$mail->setFrom('musienko.work@gmail.com', 'kanatka.in.ua'); 
	//To...
	$mail->addAddress('musienko.work@gmail.com');
	//Subject
	$mail->Subject = 'Повідомлення з сайту';

	//Body
	$body = '<h1>Нове повідомлення з сайту</h1>';

	if(trim(!empty($_POST['user-name']))){
		$body .= "<p>Імя: <strong>".$_POST['user-name']."</strong></p>";
	}
	if(trim(!empty($_POST['user-tel']))){
		$body .= "<p>Номер телефону: <strong>".$_POST['user-tel']."</strong></p>";
	}
	//Add File
	if(trim(!empty($_FILES['image']['tmp_name']))){
		$fileTmpName = $_FILES['image']['tmp_name'];
		$fileName = $_FILES['image']['name'];
		$mail->addAttachment($fileTmpName, $fileName);
	}

	
	$mail->Body = $body;

	//Sending
	$mail->send();
	$mail->smtpClose();
?>