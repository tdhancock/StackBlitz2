document.addEventListener('DOMContentLoaded', function (event) {
  colorPicker();
  $('#uvuLabel').addClass('hidden');
  $('#uvuId').addClass('hidden');

  //Populate class list
  classList();

  //Event Listener for the class list
  $('#course').on('change', function () {
    var value = this.value;
    //console.log(this.value);
    if (value != '') {
      $('#uvuLabel').removeClass('hidden');
      $('#uvuId').removeClass('hidden');
    } else {
      $('#uvuLabel').addClass('hidden');
      $('#uvuId').addClass('hidden');
    }
  });

  //Event listener for the UVU ID
  let uvuId = $('#uvuId');
  //console.log(uvuId);
  uvuId.on('input', function () {
    //console.log(uvuId.val().length);
    if (uvuId.val().length == 8) {
      let body = $('ul')[0];
      // remove all child nodes
      if (body.lastChild) {
        $('#logsDisplay').innerHtml('');
      }
      let id = uvuId.val();
      //console.log(id);
      //console.log(id);
      var select = $('#course');
      var value = select.val();
      //console.log(value);
      fillInfo(value, id);
    }
  });

  //Event listener for the Submit a new log
  $('#submitBtn').on('click', function () {
    let text = $('#logText').val();
    console.log(text);
    let data = {
      courseId: $('#course').val(),
      date: new Date().toLocaleString('en-us').replace(',', ''),
      text: text,
      uvuId: $('#uvuId').val(),
      id: createUUID(),
    };
    post({
      courseId: $('#course').val(),
      date: new Date().toLocaleString('en-us').replace(',', ''),
      text: text,
      uvuId: $('#uvuId').val(),
      id: createUUID(),
    }).then((x) => {
      console.log(x);
      fillInfo($('#course').val(), $('#uvuId').val());
    });
  });

  $('#theme').on('click', function () {
    if (document.documentElement.classList == 'dark') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.cookie = 'theme=light';
      console.log('Changed cookie to: ' + document.cookie);
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      document.cookie = 'theme=dark';
      console.log('Changed cookie to: ' + document.cookie);
    }
  });
});

//GET
//POST
//Class list
async function classList() {
  let val = await axios.get(
    'https://github-z6mbkv--3000.local.webcontainer.io/api/v1/courses'
  );
  //console.log(val.data);
  let data = val.data;
  let el = $('#course')[0];

  for (i = 0; i < data.length; i++) {
    let node = document.createElement('option');
    let textnode = data[i].display;
    node.textContent = textnode;
    node.setAttribute('id', data[i].id);
    node.setAttribute('value', data[i].id);
    el.appendChild(node);
    //let val = `<option id='${data.id}' value='${data.id}'>${data.display}</option>`;
  }
}

async function fillInfo(value, id) {
  let logs = await get(value, id);
  //console.log(logs);
  $('#uvuIdDisplay').innerHtml(`Student Logs for ${id}`);

  $('#logsDisplay').innerHtml('');

  for (let log in logs) {
    let newLog = `<li id="logId${log}" class="">
    <div><small>${logs[log].date}</small></div>
    <p>${logs[log].text}</p>
    </li>`;

    let text = $('#logsDisplay').innerHtml();
    text += newLog;
    $('#logsDisplay').innerHtml(text);
  }

  for (let log in logs) {
    $(`#logId${log}`).on('click', function () {
      if ($(`#logId${log} > p`).hasClass('hidden')) {
        $(`#logId${log} > p`).removeClass('hidden');
      } else {
        $(`#logId${log} > p`).addClass('hidden');
      }
    });
  }
}

async function get(value, id) {
  const res = await axios.get(
    `https://github-z6mbkv--3000.local.webcontainer.io/api/v1/logs?courseId=${value}&uvuId=${id}`
  );
  return res.data;
}

function createUUID() {
  return 'xxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function post(data) {
  let val = await axios.post(
    'https://github-z6mbkv--3000.local.webcontainer.io/api/v1/logs',
    data
  );
  return await val;
}

function colorPicker() {
  let pref = getCookie('theme');
  if (pref != '') {
    console.log('pref = ' + pref);
    if (pref == 'dark') {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    if (pref == 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  } else {
    let dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log(dark);
    if (dark) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }
  //User Preference
  //Browser Preference
  //OS Preference
  //Light default
}

function getCookie(cname) {
  let name = cname + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

function clearCookies() {
  document.cookie.split(';').forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
  });
}
