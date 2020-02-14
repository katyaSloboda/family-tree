$(function() {
  $("#cancelbtn").click(function(event) {
    if (!confirm('Ви дійсно хочете скасувати зміни?'))
      event.preventDefault();
  });

  $("#deletebtn").click(function(event) {
    if (!confirm('Видалити запис?'))
      event.preventDefault();
  });
});
