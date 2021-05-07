function alert(content,afterFunction){
$('<div class="alertm_overlay"></div>').appendTo('body');
$('<div class="alertm_all"><div class="alertm_wrapper">'+content+'</div><div class="alertm_but" onclick="alert_close('+afterFunction+'); return false">OK</div></div>').appendTo('body');
$(".alertm_overlay, .alertm_all").fadeIn("slow");
$('.alertm_all').css('margin-top', (-1)*($('.alertm_all').height())+'px');
}
function alert_close(afterFunctionClouse){
$(".alertm_overlay, .alertm_all").remove();
afterFunctionClouse;
}



$(document).ready(function() {

	//E-mail Ajax Send
	$("form").submit(function() { //Change
		var th = $(this);
		$.ajax({
			type: "POST",
			url: "mail.php", //Change
			data: th.serialize()
		}).done(function() {
			alert("Ваше сообщение отправлено!<br>Мы свяжемся с вами в ближайшее время");
			setTimeout(function() {
				// Done Functions
				th.trigger("reset");
			}, 1000);
		});
		return false;
	});

});





