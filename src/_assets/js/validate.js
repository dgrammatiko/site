(function (document) {
  function hasHtml5Validation() {
    return typeof document.createElement('input').checkValidity === 'function';
  }

  if (hasHtml5Validation()) {
    document.querySelector('form').addEventListener('submit', function (e) {
      event.preventDefault();
      var form = this;

      if (!this.checkValidity()) {
        form.classList.add('invalid');
        return false;
      } else {
        var formData = {};
        var fields = [];
        var xhr = new XMLHttpRequest();
        formData.formGoogleSheetName = 'responses';
        formData.honeypot = false;

        form.classList.remove('invalid');

        [].slice.call(form.querySelectorAll('input, textarea')).forEach(function (field) {
          formData[field.name] = field.value;
          fields.push(field.name);
        });

        var encoded = Object.keys(formData).map(function (k) {
          return encodeURIComponent(k) + '=' + encodeURIComponent(formData[k]);
        }).join('&');

        xhr.open('POST', 'https:\/\/script.google.com\/macros\/s\/AKfycbygq4sdW2e7EbNCvRS2-C51DaW5G_dQJHzFbdEIHglwdZBIQrBJ\/exec');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            form.reset();
            form.style.display = 'none';

            var thankYouMessage = document.querySelector('#thankyou_message');
            if (thankYouMessage) {
              thankYouMessage.style.display = 'block';
            }
          }
        };

        xhr.send(encoded);
      };
    });
  }
})(document);
