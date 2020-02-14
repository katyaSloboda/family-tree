$(function() {
  let urls = ['https://ru.wikipedia.org/wiki/Семья',
              'https://ru.wikipedia.org/wiki/Семейные_ценности',
              'http://familyis.ru/10-osnovnykh-cennostejj-semejjnykh-otnoshenijj.html'];

  urls.forEach((url) => {
    $.ajax({
      type: 'POST',
      url: '/articles',
      data: { url: url },
      dataType: 'json',
      success: function(resp) {
        let ps = '';
        for (var i = 0; i < resp.ps.length; i++)
          ps += '<p>'+ resp.ps[i] +'</p>';
        $('body').append('<div class="scraping-data"><b>' + resp.url +
                         '</b><br>' + ps + '</div>');
      },
      error: function(req, status, err) {
        console.log('что-то пошло не так', status, err);
      }
    });
  });
});
