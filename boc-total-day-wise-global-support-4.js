  document.addEventListener("DOMContentLoaded", function () {
      var timeElements = document.querySelectorAll("time.published"); // Select all time elements
      
      timeElements.forEach(function (timeElement) {
          var dateStr = timeElement.getAttribute("datetime");
          if (dateStr) {
              var date = new Date(dateStr);

              var options = {
                  year: "numeric", month: "long", day: "numeric",
                  hour: "2-digit", minute: "2-digit",
                  hour12: true, timeZone: "Asia/Kolkata"
              };

              timeElement.innerHTML = date.toLocaleString("en-US", options) + " IST - NF360";
          }
      });
  });
