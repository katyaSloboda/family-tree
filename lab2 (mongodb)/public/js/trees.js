function deleteTree(id) {
  if (!confirm('Видалити запис?') || !id)
    return;

  $.ajax({
    type: 'POST',
    url: '/delete-tree',
    data: { id: id },
    dataType: 'json',
    success: function(resp) {
      $('#btn-del-' + resp).parent().remove();
    },
    error: function(req, status, err) {
      console.log('что-то пошло не так', status, err);
    }
  });
}
