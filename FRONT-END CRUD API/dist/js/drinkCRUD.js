/***REGION 1: Vùng khai báo các biến, hằng số, toàn cục ***/
"use strict";
const gDRINK_COL = ["id", "drinkCode", "drinkName", "price", "note", "actions"];
const gDRINK_STT_COL = 0;
const gDRINK_CODE_COL = 1;
const gDRINK_NAME_COL = 2;
const gDRINK_PRICE_COL = 3;
const gDRINK_NOTE_COL = 4;
const gDRINK_ACTIONS_COL = 5;

var gSTT = 1;

var gDrinkId = 0;

var gFormMode = "";

var gDrinkTable = $("#drink-table").DataTable({
    columns: [
        { data: gDRINK_COL[gDRINK_STT_COL] },
        { data: gDRINK_COL[gDRINK_CODE_COL] },
        { data: gDRINK_COL[gDRINK_NAME_COL] },
        { data: gDRINK_COL[gDRINK_PRICE_COL] },
        { data: gDRINK_COL[gDRINK_NOTE_COL] },
        { data: gDRINK_COL[gDRINK_ACTIONS_COL] },
    ],

    columnDefs: [
        {
            targets: gDRINK_ACTIONS_COL,
            defaultContent: `
                <span ><i class="fas fa-edit fa-lg text-primary edit-drink " style="cursor: pointer" data-toggle="tooltip" title="Edit"></i></span>
                <span ><i class="far fa-trash-alt fa-lg ml-2 text-danger delete-drink" style="cursor: pointer" data-toggle="tooltip" title="Delete"></i></span>
            `
        },

        {
            targets: gDRINK_STT_COL,
            render: function() {
                return gSTT++;
            }
        }
    ]
})

/***REGION 2: Vùng thực thi các sự kiện ***/
$(document).ready(function() {
    onPageLoading();

    $("#btn-save-drink").on("click", onBtnSaveDrinkClick);

    $("#drink-table").on("click", ".edit-drink", function () {
        onIconEditDrinkClick(this);
    });

    $("#drink-table").on("click", ".delete-drink", function () {
        onIconDeleteDrinkClick(this);
    });

    $("#btn-delete-drink").on("click", onBtnDeleteDrinkClick);

    //reset dữ liệu khi click nút cancel
    $('#modalDeleteDrink').on('hidden.bs.modal', function () {
        resetForm();
    });
})



/***REGION 3: Vùng khai báo các hàm xử lý sự kiện ***/
// hàm xử lý sự kiện load trang
function onPageLoading() {
    "use strict";
    callApiGetDataDrinkList();
   
}

// hàm xử lý sự kiện khi click nút save 
function onBtnSaveDrinkClick() {
    "use strict";
    var vDrinkObject = {
        drinkCode: "",
        drinkName: "",
        price: "",
        note: "",
    }

    //B1: thu thập dữ liệu
    getDataForm(vDrinkObject);
    //B2: validate dữ liệu
    var vIsValidate = validateDataForm(vDrinkObject);
    if (vIsValidate) {
        //B3: Xử lý nghiệp vụ call api tạo mới hoặc cập nhật voucher
        if (gFormMode === "Insert") { // update
            callApiUpdateDrink(vDrinkObject, gDrinkId);
        } else { // insert
            callApiCreateDrink(vDrinkObject); 
        }
    }
    resetForm();
}

// hàm xử lý sự kiện khi click icon edit
function onIconEditDrinkClick(paramIconElement) {
    "use strict";
    // trạng thái nhận biết insert
    gFormMode = "Insert";
    // lấy id của row tương ứng
    gDrinkId = getDrinkIdToDataRowTable(paramIconElement);
    callApiGetDrinkById(gDrinkId);
}

// hàm xử lý sự kiện click icon delete drink
function onIconDeleteDrinkClick(paramIconElement) {
    "use strict";
    // lấy id của row tương ứng
    gDrinkId = getDrinkIdToDataRowTable(paramIconElement);
    // hiển thị modal xác nhận
    $("#modalDeleteDrink").modal("show");
}

// hàm xử lý sự kiện click nút delete drink
function onBtnDeleteDrinkClick() {
    "use strict";
    callApiDeleteDrink(gDrinkId);
    // ẩn modal
    $("#modalDeleteDrink").modal("hide");

}



/***REGION 4: Vùng khai báo các hàm dùng chung trong chương trình ***/
// hàm thu thập dữ liệu trên form
function getDataForm(paramDrinkObj) {
    "use strict";
    paramDrinkObj.drinkCode = $("#inp-drink-code").val();
    paramDrinkObj.drinkName = $("#inp-drink-name").val();
    paramDrinkObj.price = $("#inp-price").val();
    paramDrinkObj.note = $("#inp-note").val();
}

// hàm validate dữ liệu
function validateDataForm(paramDrinkObj) {
    "use strict";
    if (paramDrinkObj.drinkCode === "") {
        alert("Xin nhập mã nước uống!");
        return false;
    }
    if (paramDrinkObj.drinkName === "") {
        alert("Xin nhập tên nước uống!");
        return false;
    }
    if (paramDrinkObj.price === "") {
        alert("Xin nhập đơn giá!");
        return false;
    }

    return true;
}

// hàm call api lấy danh sách đồ uống
function callApiGetDataDrinkList() {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/drink/all",
        type: "GET",
        dataType: "json",
        success: function (res) {
            // console.log(res);
            loadDataDrinkListToTable(res);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call Api lấy drink theo id
function callApiGetDrinkById(paramDrinkId) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/drink/detail/" + paramDrinkId,
        type: "GET",
        dataType: "json",
        success: function (res) {
            // console.log(res);
            loadDataDrinkToForm(res);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call Api create drink
function callApiCreateDrink(paramDrinkObject) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/drink/create",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(paramDrinkObject),
        success: function (res) {
            // console.log(res);
            callApiGetDataDrinkList();
           
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call api update drink
function callApiUpdateDrink(paramDrinkObject, paramDrinkId) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/drink/update/" + paramDrinkId,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(paramDrinkObject),
        success: function (res) {
            // console.log(res);
            callApiGetDataDrinkList();

        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call Api delete drink
function callApiDeleteDrink(paramDrinkId) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/drink/delete/" + paramDrinkId,
        type: "DELETE",
        success: function () {
            alert("Delete đồ uống thành công!");
            resetForm();
            callApiGetDataDrinkList();
           
        },
        error: function (err) {
            console.log(err);
        }
    });
}

//hàm hiển thị danh sách voucher lên table
function loadDataDrinkListToTable(paramResponseDrink) {
    "use strict";
    gDrinkTable.clear();
    gDrinkTable.rows.add(paramResponseDrink);
    gDrinkTable.draw();
}

// hàm hiển thị thông tin drink cần edit lên form 
function loadDataDrinkToForm(paramDrinkObj) {
    "use strict";
    $("#inp-drink-code").val(paramDrinkObj.drinkCode);
    $("#inp-drink-name").val(paramDrinkObj.drinkName);
    $("#inp-price").val(paramDrinkObj.price);
    $("#inp-note").val(paramDrinkObj.note);
}

// hàm lấy drink id từ row tương ứng trong table
function getDrinkIdToDataRowTable(paramIconElement) {
    "use strict";
    var vRowSelected = $(paramIconElement).closest("tr");
    var vDataRow = gDrinkTable.row(vRowSelected).data();
    return vDataRow.id;
}


// hàm reset form 
function resetForm() {
    "use strict";
    gSTT = 1;
    gDrinkId = 0;

    $("#inp-drink-code").val("")
    $("#inp-drink-name").val("");
    $("#inp-price").val("");
    $("#inp-note").val("");
}