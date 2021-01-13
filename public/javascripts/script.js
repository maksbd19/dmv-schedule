$(document).ready(function ($) {
  var $el = $("#schedule-table tbody");
  var $lut = $('.lut');
  var $loader = $('.loading');
  var timer = '';

  const _now = () => {
    const d = new Date();
    return d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
  }

  const updateTable = (data) => {
    var html = '';

    for (var i = 0; i < data.length; i++) {
      const { name, days, times } = data[i];

      const daysHtml = days.map(d => d.date).join(" ");
      const timesHtml = Object.values(times).map(d => {
        return '<ul>' + d.map(t => '<li>' + t.date + ' ' + t.time + '</li>') + '</li>';
      })

      html += `
						<tr>
							<td>${i + 1}</td>
							<td>${name}</td>
							<td>${daysHtml}</td>
							<td>${timesHtml}</td>
						</tr>`;
    }

    $el.html(html);
    $lut.html(_now());
  }

  const socket = io();

  socket.on('message', data => {
    console.log(data);

    if (Array.isArray(data) && data.length > 0) {
      updateTable(data);
    }
    
    $loader.removeClass('display-inline').addClass('hidden');

    prepareTimer();
    // cb(msg);
  });

  function hook() {
    socket.emit('message');
    $loader.removeClass('hidden').addClass('display-inline');
  }

  function prepareTimer() {
    timer = setTimeout(function () {
      hook();
    }, 5 * 1000);
  }

  hook();

});