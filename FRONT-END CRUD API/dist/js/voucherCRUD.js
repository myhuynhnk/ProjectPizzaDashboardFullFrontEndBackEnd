/***REGION 1: Vùng khai báo các biến, hằng số, toàn cục ***/
"use strict";

const gVOUCHER_COL = ["id", "maVoucher", "phanTramGiamGia", "ghiChu", "ngayTao", "ngayCapNhat", "actions"];
const gVOUCHER_STT_COL = 0;
const gVOUCHER_CODE_COL = 1;
const gVOUCHER_DISCOUNT_COL = 2;
const gVOUCHER_NOTE_COL = 3;
const gVOUCHER_CREATE_DATE_COL = 4;
const gVOUCHER_UPDATE_DATE_COL = 5;
const gVOUCHER_ACTIONS_COL = 6;

var gFormMode = ""

var gSTT = 1;

var gVoucherId = 0;

var gVoucherTable = $("#voucher-table").DataTable({
    columns: [
        { data: gVOUCHER_COL[gVOUCHER_STT_COL] },
        { data: gVOUCHER_COL[gVOUCHER_CODE_COL] },
        { data: gVOUCHER_COL[gVOUCHER_DISCOUNT_COL] },
        { data: gVOUCHER_COL[gVOUCHER_NOTE_COL] },
        { data: gVOUCHER_COL[gVOUCHER_CREATE_DATE_COL] },
        { data: gVOUCHER_COL[gVOUCHER_UPDATE_DATE_COL] },
        { data: gVOUCHER_COL[gVOUCHER_ACTIONS_COL] },
    ],

    columnDefs: [
        {
            targets: gVOUCHER_STT_COL,
            render: function () {
                return gSTT++;
            },

        },

        {
            targets: gVOUCHER_ACTIONS_COL,
            defaultContent: `
                <span ><i class="fas fa-edit fa-lg text-primary edit-voucher " style="cursor: pointer" data-toggle="tooltip" title="Edit"></i></span>
                <span ><i class="far fa-trash-alt fa-lg ml-2 text-danger delete-voucher" style="cursor: pointer" data-toggle="tooltip" title="Delete"></i></span>
            `
        },

    ]
});

/***REGION 2: Vùng thực thi các sự kiện ***/
$(document).ready(function () {
    onPageLoading();

    $("#btn-save").on("click", onBtnSaveVoucherClick);

    $("#voucher-table").on("click", ".edit-voucher", function () {
        onIconEditVoucherClick(this);
    });

    $("#voucher-table").on("click", ".delete-voucher", function () {
        onIconDeleteVoucherClick(this);
    });

    $("#btn-delete-voucher").on("click", onBtnDeleteVoucherClick);

    //reset dữ liệu khi click nút cancel
    $('#modalDeleteVoucher').on('hidden.bs.modal', function () {
        resetForm();
    });
})

/***REGION 3: Vùng khai báo các hàm xử lý sự kiện ***/
// hàm xử lý sự kiện khi load trang
function onPageLoading() {
    "use strict";
    callApiGetDataListVoucher();
}

// hàm xử lý sự kiện click nút save
function onBtnSaveVoucherClick() {
    "use strict";
    var vVoucherObj = {
        maVoucher: "",
        phanTramGiamGia: "",
        ghiChu: "",
    }

    //B1: thu thập dữ liệu
    getDataForm(vVoucherObj);
    //B2: validate dữ liệu
    var vIsValidate = validateDataForm(vVoucherObj);
    if (vIsValidate) {
        //B3: Xử lý nghiệp vụ call api tạo mới hoặc cập nhật voucher
        if (gFormMode === "Insert") { // update
            callApiUpdateVoucher(vVoucherObj, gVoucherId);
        } else { // insert
            callApiCreateVoucher(vVoucherObj);

        }
    }

    resetForm();
}

// hàm xử lý sự kiện click icon edit voucher 
function onIconEditVoucherClick(paramIconEditElement) {
    "use strict";
    // trạng thái nhận biết insert
    gFormMode = "Insert";
    // lấy id của row tương ứng
    gVoucherId = getVoucherIdToDataRowTable(paramIconEditElement);
    callApiGetVoucherById(gVoucherId);
}

// hàm xử lý sự kiện click icon delete voucher
function onIconDeleteVoucherClick(paramIconDeleteElement) {
    "use strict";
    // lấy id của row tương ứng
    gVoucherId = getVoucherIdToDataRowTable(paramIconDeleteElement);
    // hiển thị modal xác nhận
    $("#modalDeleteVoucher").modal("show");
}

// hàm xử lý sự kiện click nút delete voucher
function onBtnDeleteVoucherClick() {
    "use strict";
    callApiDeleteVoucher(gVoucherId);
    // ẩn modal
    $("#modalDeleteVoucher").modal("hide");
}


/***REGION 4: Vùng khai báo các hàm dùng chung trong chương trình ***/
// hàm thu thập dữ liệu trên form
function getDataForm(paramVoucherObj) {
    "use strict";
    paramVoucherObj.maVoucher = $("#inp-voucher-code").val();
    paramVoucherObj.phanTramGiamGia = $("#inp-discount").val();
    paramVoucherObj.ghiChu = $("#inp-note").val();
}

// hàm validate dữ liệu
function validateDataForm(paramVoucherObj) {
    "use strict";
    if (paramVoucherObj.maVoucher === "") {
        alert("Xin nhập mã voucher!");
        return false;
    }
    if (paramVoucherObj.phanTramGiamGia === "") {
        alert("Xin nhập phần trăm giảm giá!");
        return false;
    }
    if (paramVoucherObj.ghiChu === "") {
        alert("Xin nhập ghi chú!");
        return false;
    }

    return true;
}

// hàm call api lấy danh sách voucher
function callApiGetDataListVoucher() {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/voucher/all",
        type: "GET",
        dataType: "json",
        success: function (res) {
            // console.log(res);
            loadDataVoucherListToTable(res);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call api lấy một voucher theo id
function callApiGetVoucherById(paramVoucherId) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/voucher/detail/" + paramVoucherId,
        type: "GET",
        dataType: "json",
        success: function (res) {
            // console.log(res);
            loadDataVoucherToForm(res);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call api tạo mới một voucher
function callApiCreateVoucher(paramVoucherObject) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/voucher/create",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(paramVoucherObject),
        success: function (res) {
            console.log(res);
            callApiGetDataListVoucher();

        },
        error: function (err) {
            console.log(err);
        }
    });
}


// hàm call api update voucher
function callApiUpdateVoucher(paramVoucherObject, paramVoucherId) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/voucher/update/" + paramVoucherId,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(paramVoucherObject),
        success: function (res) {
            console.log(res);
            callApiGetDataListVoucher();

        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call Api delete voucher
function callApiDeleteVoucher(paramVoucherId) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/voucher/delete/" + paramVoucherId,
        type: "DELETE",
        success: function () {
            alert("Delete Voucher thành công!");
            callApiGetDataListVoucher();
        },
        error: function (err) {
            console.log(err);
        }
    });
}


//hàm hiển thị danh sách voucher lên table
function loadDataVoucherListToTable(paremResponseVoucher) {
    "use strict";
    gVoucherTable.clear();
    gVoucherTable.rows.add(paremResponseVoucher);
    gVoucherTable.draw();
}

// hàm hiển thị thông tin voucher cần edit lên form 
function loadDataVoucherToForm(paramVoucherObj) {
    "use strict";
    // convert ngày tháng từ backend trả về (dd-mm-yyyy) theo đúng format form front end ("yyyy-MM-dd")
    var dateNgayTao = new Date(paramVoucherObj.ngayTao);
    var vNgayTao = formatDate(dateNgayTao.toDateString());

    var dateNgayCapNhat = new Date(paramVoucherObj.ngayCapNhat);
    var vNgayCapNhat = formatDate(dateNgayCapNhat.toDateString());

    $("#inp-voucher-code").val(paramVoucherObj.maVoucher);
    $("#inp-discount").val(paramVoucherObj.phanTramGiamGia);
    $("#inp-note").val(paramVoucherObj.ghiChu);
    $("#inp-create").val(vNgayTao);
    $("#inp-update").val(vNgayCapNhat);
}

// hàm lấy voucher id từ row tương ứng trong table
function getVoucherIdToDataRowTable(paramIconElement) {
    "use strict";
    var vRowSelected = $(paramIconElement).closest("tr");
    var vDataRow = gVoucherTable.row(vRowSelected).data();
    return vDataRow.id;
}

// hàm convert định dạng Date về dạng String format (yyyy-MM-dd)
function formatDate(paramDate) {
    "use strict";
    var d = new Date(paramDate);
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

// hàm reset form 
function resetForm() {
    "use strict";
    gSTT = 1;
    gVoucherId = 0;

    $("#inp-voucher-code").val("");
    $("#inp-discount").val("");
    $("#inp-note").val("");
    $("#inp-create").val("");
    $("#inp-update").val("");
}