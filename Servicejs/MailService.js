MailService = { AddMail:
     function (a) {
          return new Promise(function (i, n)
           { $.ajax({ type: "POST", url: "/okul/MailService/mail.php",
            datatype: "application/json", 
            data: a,
             success: function (a, n, t)
             { a.length ? i(a) : i(a.status) },
              error: function (a, n, t) { i("") } }) }) } };