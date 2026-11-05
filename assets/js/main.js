/* main.js - تفاعلات الموقع (jQuery + JavaScript عادي) */

var cur = 0;       // الشريحة الحالية
var total = 0;     // عدد الشرائح
var timer = null;

$(document).ready(function () {
    // الوضع الداكن المحفوظ
    if (localStorage.getItem("dark") == "1") $("body").addClass("dark");

    // السلايدر
    total = $(".slide").length;
    if (total > 0) {
        $(".slide").hide();
        $(".slide").eq(0).show();
        showCount();
        timer = setTimeout(autoSlide, 5000);
    }

    // كم يوم باقي على كل فعالية
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    for (var i = 0; i < $(".ev").length; i++) {
        var p = $(".ev").eq(i).attr("data-date").split("-");
        var d = new Date(p[0], p[1] - 1, p[2]);
        var days = Math.round((d - today) / 86400000);
        var txt;
        if (days < 0) txt = "انتهت";
        else if (days == 0) txt = "الحدث اليوم";
        else if (days == 1) txt = "غداً";
        else txt = "بعد " + days + " يوم";
        $(".when").eq(i).text(txt);
    }

    // آخر تصنيف اختاره المستخدم
    if ($("#catSel").length > 0) {
        var saved = localStorage.getItem("cat");
        if (saved) {
            $("#catSel").val(saved);
            applyFilter();
        }
    }
});

function toggleDark() {
    $("body").toggleClass("dark");
    if ($("body").hasClass("dark")) {
        localStorage.setItem("dark", "1");
    } else {
        localStorage.setItem("dark", "0");
    }
}

function showCount() {
    $("#slideNo").text((cur + 1) + " / " + total);
}

function goSlide(step) {
    var next = cur + step;
    if (next >= total) next = 0;
    if (next < 0) next = total - 1;
    $(".slide").hide();
    $(".slide").eq(next).fadeIn(300);
    cur = next;
    showCount();
}

// تبديل تلقائي كل 5 ثواني
function autoSlide() {
    goSlide(1);
    timer = setTimeout(autoSlide, 5000);
}

// السابق/التالي
function clickSlide(step) {
    goSlide(step);
}

/* ---- فلترة الفعاليات ---- */
function applyFilter() {
    var q = $("#q").val();
    var cat = $("#catSel").val();
    var place = $("#placeSel").val();
    var from = $("#fromDate").val();
    var to = $("#toDate").val();
    var shown = 0;

    localStorage.setItem("cat", cat);

    for (var i = 0; i < $(".ev").length; i++) {
        var ev = $(".ev").eq(i);
        var title = $(".ev h3").eq(i).text();
        var ok = true;
        if (q != "" && title.indexOf(q) == -1) ok = false;
        if (cat != "all" && ev.attr("data-cat") != cat) ok = false;
        if (place != "all" && ev.attr("data-place") != place) ok = false;
        if (from != "" && ev.attr("data-date") < from) ok = false;
        if (to != "" && ev.attr("data-date") > to) ok = false;

        if (ok) {
            ev.show();
            shown++;
        } else {
            ev.hide();
        }
    }

    if (shown == 0) {
        $("#noRes").show();
    } else {
        $("#noRes").hide();
    }
}

function resetFilter() {
    $("#q").val("");
    $("#catSel").val("all");
    $("#placeSel").val("all");
    $("#fromDate").val("");
    $("#toDate").val("");
    applyFilter();
}

/* ---- رسائل التنبيه (Bootstrap Alerts) ---- */
function showMsg(type, text) {
    $("#msgBox").html('<div class="alert alert-' + type + '">' + text + '</div>');
}

/* ---- حجز مكان (Modal) ---- */
function bookSeat() {
    var n = $("#bname").val();
    if (n.length < 3) {
        $("#bookMsg").html('<div class="alert alert-danger">اكتب اسمك الكامل لإتمام الحجز.</div>');
    } else {
        $("#bookMsg").html('<div class="alert alert-success">تم حجز مكان باسم ' + n + '.</div>');
    }
}

/* ---- نموذج اتصل بنا ---- */
function checkForm() {
    var name = document.getElementById("cname").value;
    var mail = document.getElementById("cmail").value;
    var msg = document.getElementById("cmsg").value;
    var mailPat = /^\w+([\.\-\+]?\w+)*@\w+([\.\-]?\w+)*\.\w{2,}$/;

    if (name.length < 3) {
        showMsg("danger", "الاسم قصير، اكتب ثلاثة أحرف على الأقل.");
    } else if (mail.search(mailPat) == -1) {
        showMsg("danger", "البريد الإلكتروني غير صحيح، مثال: name@example.com");
    } else if (msg.length < 10) {
        showMsg("danger", "الرسالة قصيرة، اكتب عشرة أحرف على الأقل.");
    } else {
        showMsg("success", "وصلتنا رسالتك، سنرد عليك قريباً.");
    }
    return false;   // ما في إرسال فعلي لأن الموقع بدون سيرفر
}
