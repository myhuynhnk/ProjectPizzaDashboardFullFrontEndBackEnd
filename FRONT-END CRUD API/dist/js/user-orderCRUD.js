/***REGION 1: Vùng khai báo các biến, hằng số, toàn cục ***/
"use strict";
const gUSER_COL = ["id", "fullName", "email", "phone", "address", "actions"];
const gUSER_STT_COL = 0;
const gUSER_NAME_COL = 1;
const gUSER_EMAIL_COL = 2;
const gUSER_PHONE_COL = 3;
const gUSER_ADDRESS_COL = 4;
const gUSER_ACTIONS_COL = 5;

const gORDER_COL = ["id", "orderId", "size", "diameter", "grill", "countDrink", "salad", "softDrink", "typePizza", "totalPrice", "status", "message", "actions"];
const gORDER_STT_COL = 0;
const gORDER_CODE_COL = 1;
const gORDER_SIZE_COL = 1;
const gORDER_DIAMETER_COL = 3;
const gORDER_GRILL_COL = 4;
const gORDER_COUNT_DRINK_COL = 5;
const gORDER_SALAD_COL = 6;
const gORDER_SOFT_DRINK_COL = 7;
const gORDER_PIZZA_COL = 8;
const gORDER_PRICE_COL = 9;
const gORDER_STATUS_COL = 10;
const gORDER_MESSAGE_COL = 11;
const gORDER_ACTIONS_COL = 12;

var gSTT = 1;

var gUserId = 0;

var gOrderId = 0;

var gFormMode = "";


/***REGION 2: Vùng thực thi các sự kiện ***/
$(document).ready(function () {
    onPageLoading();

    $("#btn-save-user").on("click", onBtnSaveUserClick);

    $("body").delegate(".edit-user", "click", function () {
        onIconEditUserClick(this);
    });

    $("body").delegate(".delete-user", "click", function () {
        onIconDeleteUserClick(this);
    });

    $("body").delegate(".add-order", "click", function () {
        onIconAddOrderClick(this);
    });

    $("#btn-delete-user").on("click", onBtnDeleteUserClick);

    //reset dữ liệu khi click nút cancel
    $('#modalDeleteUser').on('hidden.bs.modal', function () {
        resetForm();
    });

    // sự kiện click nút save order
    $("#btn-save-order").on("click", onBtnSaveOrderClick);

    $("body").delegate(".edit-order", "click", function() {
        onIconEditOrderClick(this);
    });

    $("body").delegate(".delete-order", "click", function() {
        onIconDeleteOrderClick(this);
    });


    // sự kiện click hiển thị danh sách country
    $("#btn-show-user").on("click", onBtnShowListUserClick);

    // sự kiện click hiển thị danh sách region
    $("#btn-show-order").on("click", onBtnShowListOrderClick);

    $("#btn-delete-order").on("click", onBtnDeleteOrderClick)

})



/***REGION 3: Vùng khai báo các hàm xử lý sự kiện ***/
// hàm xử lý sự kiện load trang
function onPageLoading() {
    "use strict";
    createAndGetDataUserToTable()


}

// hàm xử lý sự kiện click nút show list user
function onBtnShowListUserClick() {
    "use strict";
    resetForm();
    createAndGetDataUserToTable();
}


// hàm xử lý sự kiện khi click nút save 
function onBtnSaveUserClick() {
    "use strict";
    var vUserObject = {
        fullName: "",
        email: "",
        phone: "",
        address: "",
    }

    //B1: thu thập dữ liệu
    getDataUserForm(vUserObject);
    //B2: validate dữ liệu
    var vIsValidate = validateDataForm(vUserObject);
    if (vIsValidate) {
        //B3: Xử lý nghiệp vụ call api tạo mới hoặc cập nhật menu
        if (gFormMode === "Insert") { // update
            callApiUpdateUser(vUserObject, gUserId);
        } else { // insert
            callApiCreateUser(vUserObject);
        }
    }
    resetForm();
}

// hàm xử lý sự kiện khi click icon user
function onIconEditUserClick(paramIconElement) {
    "use strict";
    // trạng thái nhận biết insert
    gFormMode = "Insert";
    // lấy id của row tương ứng
    gUserId = getUserIdToDataRowTable(paramIconElement);
    callApiGetUserById(gUserId);
}

// hàm xử lý sự kiện click icon delete user
function onIconDeleteUserClick(paramIconElement) {
    "use strict";
    // lấy id của row tương ứng
    gUserId = getUserIdToDataRowTable(paramIconElement);
    // hiển thị modal xác nhận
    $("#modalDeleteUser").modal("show");
}

// hàm xử lý sự kiện click nút delete user
function onBtnDeleteUserClick() {
    "use strict";
    callApiDeleteUser(gUserId);
    // ẩn modal
    $("#modalDeleteUser").modal("hide");

}

/**
 * Các hàm sự kiện với order
*/
// hàm xử lý sự kiện click nút show list Order hiển thị danh sách
function onBtnShowListOrderClick() {
    "use strict";
    resetForm();
    createTableAndLoadDataOrderToTable();
}

// hàm xử lý sự kiện click icon edit order
function onIconEditOrderClick(paramIconElement) {
    "use strict";
    gFormMode = "Insert";
    gOrderId = getOrderIdToRowTable(paramIconElement);
    // disabled select country 
    loadDataDrinkToForm();
    callApiGetOrderById(gOrderId);

    // hiển thị modal form
    $("#modalFormOrder").modal("show");
}

// hàm xử lý sự kiện click icon delete order
function onIconDeleteOrderClick(paramIconElement) {
    "use strict";
    gOrderId = getOrderIdToRowTable(paramIconElement);

    $("#modalDeleteOrder").modal("show");
}

// hàm xử lý sự kiện click nút thêm order
function onIconAddOrderClick(paramIconElement) {
    "use strict";
    $("#modalFormOrder").modal("show");
    loadDataDrinkToForm();
    // lấy id của row tương ứng
    gUserId = getUserIdToDataRowTable(paramIconElement);
    
}

// hàm xử lý sự kiện click nút save order
function onBtnSaveOrderClick() {
    
    "use strict";
    var vOrderObject = {
        orderId: "",
        size: "",
        diameter: "",
        grill: "",
        countDrink: "",
        salad: "",
        softDrink: "",
        typePizza: "",
        voucherCode: "",
        totalPrice: "",
        discount: "",
        status: "",
        message: "",
        userId: "",
    }

    //B1: thu thập dữ liệu
    getDataFormOrder(vOrderObject);
    //B2: validate dữ liệu
    var vIsValidate = validateData(vOrderObject)
    if (vIsValidate) {
        //B3: Xử lý nghiệp vụ call api tạo mới hoặc cập nhật order
        if (gFormMode === "Insert") { // update
            callApiUpdateOrder(vOrderObject, gOrderId);
        } else { // insert
            callApiCreateOrder(vOrderObject);
        }
    }
    resetForm();
}

// hàm xử lý sự kiện click nút delete order
function onBtnDeleteOrderClick() {
    "use strict";
    callApiDeleteOrder(gOrderId);
}


/***REGION 4: Vùng khai báo các hàm dùng chung trong chương trình ***/
function createAndGetDataUserToTable() {
    "use strict";
    $("#divTable").html("");
    $("#divTable").append(`
        <h4 class="my-3">Danh sách user </h4>
        <table id="user-table" class="table table-bordered table-striped table-hover">
            <thead>
                <th>STT</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
                <th>Actions</th>
            </thead>
            <tbody></tbody> 
        </table> 
    `);

    var vTable = $("#divTable table").DataTable({
        columns: [
            { data: gUSER_COL[gUSER_STT_COL] },
            { data: gUSER_COL[gUSER_NAME_COL] },
            { data: gUSER_COL[gUSER_EMAIL_COL] },
            { data: gUSER_COL[gUSER_PHONE_COL] },
            { data: gUSER_COL[gUSER_ADDRESS_COL] },
            { data: gUSER_COL[gUSER_ACTIONS_COL] },
        ],

        columnDefs: [
            {
                targets: gUSER_ACTIONS_COL,
                defaultContent: `
                <span ><i class="fas fa-plus fa-lg text-info add-order " style="cursor: pointer" data-toggle="tooltip" title="Add order"></i></span>
                <span ><i class="fas fa-edit fa-lg ml-2 text-primary edit-user " style="cursor: pointer" data-toggle="tooltip" title="Edit"></i></span>
                <span ><i class="far fa-trash-alt fa-lg ml-2 text-danger delete-user" style="cursor: pointer" data-toggle="tooltip" title="Delete"></i></span>
            `
            },

            {
                targets: gUSER_STT_COL,
                render: function () {
                    return gSTT++;
                }
            }
        ]
    })

    callApiGetDataUserList(vTable);
}


function createTableAndLoadDataOrderToTable() {
    "use strict";
    $("#divTable").html("");
    $("#divTable").append(`
        <h4 class="my-3">Danh sách vùng </h4>
        <table id="order-table" class="table table-bordered table-striped table-hover">
            <thead>
                <th>STT</th>
                <th>OrderId</th>
                <th>Size</th>
                <th>Đường kính</th>
                <th>Sườn nướng</th>
                <th>Số lượng nước ngọt</th>
                <th>Salad</th>
                <th>Đồ uống</th>
                <th>Loại Pizza</th>
                <th>Giá tiền</th>
                <th>Trạng thái</th>
                <th>Lời nhắn</th>
                <th>Actions</th>
            </thead>
            <tbody></tbody> 
        </table> 
    `);

    var vTable = $("#divTable table").DataTable({
        columns: [
            { data: gORDER_COL[gORDER_STT_COL] },
            { data: gORDER_COL[gORDER_CODE_COL] },
            { data: gORDER_COL[gORDER_SIZE_COL] },
            { data: gORDER_COL[gORDER_DIAMETER_COL] },
            { data: gORDER_COL[gORDER_GRILL_COL] },
            { data: gORDER_COL[gORDER_COUNT_DRINK_COL] },
            { data: gORDER_COL[gORDER_SALAD_COL] },
            { data: gORDER_COL[gORDER_SOFT_DRINK_COL] },
            { data: gORDER_COL[gORDER_PIZZA_COL] },
            { data: gORDER_COL[gORDER_PRICE_COL] },
            { data: gORDER_COL[gORDER_STATUS_COL] },
            { data: gORDER_COL[gORDER_MESSAGE_COL] },
            { data: gORDER_COL[gORDER_ACTIONS_COL] },
        ],
    
        columnDefs: [
            {
                targets: gORDER_ACTIONS_COL,
                defaultContent: `
                    <span ><i class="fas fa-edit fa-lg text-primary edit-order " style="cursor: pointer" data-toggle="tooltip" title="Edit"></i></span>
                    <span ><i class="far fa-trash-alt fa-lg ml-2 text-danger delete-order" style="cursor: pointer" data-toggle="tooltip" title="Delete"></i></span>
                `
            },
    
            {
                targets: gORDER_STT_COL,
                render: function() {
                    return gSTT++;
                }
            },  
        ]
    });

    callApiGetDataOrderList(vTable);

}

// hàm thu thập dữ liệu trên form Country
function getDataUserForm(paramUserObject) {
    "use strict";
    paramUserObject.fullName = $("#inp-name").val();
    paramUserObject.email = $("#inp-email").val();
    paramUserObject.phone = $("#inp-phone").val();
    paramUserObject.address = $("#inp-address").val();
}

// hàm thu thập dữ liệu form prrder
function getDataFormOrder(paramOrderObject) {
    "use strict";
    paramOrderObject.orderId = $("#inp-order-code").val();
    paramOrderObject.size = $("#inp-size").val();
    paramOrderObject.diameter = $("#inp-diameter").val();
    paramOrderObject.grill = $("#inp-grill").val();
    paramOrderObject.countDrink = $("#inp-count-drink").val();
    paramOrderObject.salad = $("#inp-salad").val();
    paramOrderObject.softDrink = $("#select-drink option:selected").text();
    paramOrderObject.typePizza = $("#inp-type-pizza").val();
    paramOrderObject.voucherCode = $("#inp-voucher-code").val();
    paramOrderObject.totalPrice = $("#inp-total-price").val();
    paramOrderObject.discount = $("#inp-discount").val();
    paramOrderObject.status = $("#inp-status").val();
    paramOrderObject.message = $("#inp-message").val();
    paramOrderObject.userId = gUserId;
}


// hàm validate dữ liệu user
function validateDataForm(paramUserObject) {
    "use strict";
    if (paramUserObject.fullName === "") {
        alert("Xin nhập họ tên!");
        return false;
    }
    if (paramUserObject.email === "") {
        alert("Xin nhập email!");
        return false;
    }
    if (paramUserObject.phone === "") {
        alert("Xin nhập số điện thoại!");
        return false;
    }
    if (paramUserObject.address === "") {
        alert("Xin nhập địa chỉ!");
        return false;
    }

    return true;
}

// hàm validate dữ liệu form order
function validateData(paramOrderObject) {
    "use strict";
    if (paramOrderObject.size === "") {
        alert("Xin nhập mã vùng!");
        return false;
    }
    return true;
}



// hàm call api lấy danh sách country
function callApiGetDataUserList(paramTable) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/user/all",
        type: "GET",
        dataType: "json",
        success: function (res) {
            paramTable.clear();
            paramTable.rows.add(res);
            paramTable.draw();
            // loadDataCountryToSelectOption(res);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call Api lấy country theo id
function callApiGetUserById(paramUserId) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/user/detail/" + paramUserId,
        type: "GET",
        dataType: "json",
        success: function (res) {
            loadDataUserToForm(res);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call Api create country
function callApiCreateUser(paramUserObject) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/user/create",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(paramUserObject),
        success: function (res) {
            createAndGetDataUserToTable();

        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call api update country
function callApiUpdateUser(paramUserObject, paramUserId) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/user/update/" + paramUserId,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(paramUserObject),
        success: function (res) {
            // console.log(res);
            createAndGetDataUserToTable();

        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call Api delete user
function callApiDeleteUser(paramUserId) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/user/delete/" + paramUserId,
        type: "DELETE",
        success: function () {
            alert("Delete user thành công!");
            resetForm();
            createAndGetDataUserToTable();

        },
        error: function (err) {
            console.log(err);
        }
    });
}

/**
 * 
 * Hàm api của region 
 */

// hàm call api lấy danh sách order
function callApiGetDataOrderList(paramTable) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/order/all",
        type: "GET",
        dataType: "json",
        success: function (res) {
            paramTable.clear();
            paramTable.rows.add(res);
            paramTable.draw();
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call Api lấy order theo id
function callApiGetOrderById(paramOrderId) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/order/detail/" + paramOrderId,
        type: "GET",
        dataType: "json",
        success: function (res) {
           loadDataOrderToForm(res);
        },
        error: function (err) {
            console.log(err);
        }
    });
}


// hàm call api create region
function callApiCreateOrder(paramOrderObj) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/order/create/" + paramOrderObj.userId,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(paramOrderObj),
        success: function (res) {
            // console.log(res);  
            $("#modalFormOrder").modal("hide");
            createTableAndLoadDataOrderToTable();
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call Api update order
function callApiUpdateOrder(paramOrderObj, paramOrderId) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/order/update/" + paramOrderId,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(paramOrderObj),
        success: function (res) {
            // console.log(res);  
            $("#modalFormOrder").modal("hide");
            createTableAndLoadDataOrderToTable();
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call Api delete order
function callApiDeleteOrder(paramOrderId) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/order/delete/" + paramOrderId,
        type: "DELETE",
        success: function (res) { 
            $("#modalDeleteOrder").modal("hide");
            alert("Delete order thành công!");
            resetForm();
            createTableAndLoadDataOrderToTable();
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm hiển thị thông tin country cần edit lên form 
function loadDataUserToForm(paramCountryObj) {
    "use strict";
    $("#inp-name").val(paramCountryObj.fullName);
    $("#inp-email").val(paramCountryObj.email);
    $("#inp-phone").val(paramCountryObj.phone);
    $("#inp-address").val(paramCountryObj.address);
}

// hàm hiển thị dữ liệu order trả về lên form
function loadDataOrderToForm(paramOrderObject) {
    "use strict";
    $("#inp-order-code").val(paramOrderObject.orderId);
    $("#inp-size").val(paramOrderObject.size);
    $("#inp-diameter").val(paramOrderObject.diameter);
    $("#inp-grill").val(paramOrderObject.grill);
    $("#inp-count-drink").val(paramOrderObject.countDrink);
    $("#inp-salad").val(paramOrderObject.salad);
    $("#select-drink option").filter(function() {
        return $(this).text == paramOrderObject.softDrink;
    }).prop("selected", true);
    $("#inp-type-pizza").val(paramOrderObject.typePizza);
    $("#inp-voucher-code").val(paramOrderObject.voucherCode);
    $("#inp-total-price").val(paramOrderObject.totalPrice);
    $("#inp-discount").val(paramOrderObject.discount);
    $("#inp-status").val(paramOrderObject.status);
    $("#inp-message").val(paramOrderObject.message);
 
}


function loadDataDrinkToForm() {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/drink/all",
        type: "GET",
        dataType: "json",
        success: function (res) {
            // console.log(res);
            $("#select-drink").find("option:gt(0)").remove();
            res.map((bDrink) => {
                $("#select-drink").append(`
                    <option value=${bDrink.drinkCode}>${bDrink.drinkName}</option>
                `)
            })
        },
        error: function (err) {
            console.log(err);
        }
    });
}




// hàm lấy menu id từ row tương ứng trong table
function getUserIdToDataRowTable(paramIconElement) {
    "use strict";
    var vRowSelected = $(paramIconElement).closest("tr");
    var vDataRow = $("#divTable #user-table").DataTable().row(vRowSelected).data();
    return vDataRow.id;
}

function getOrderIdToRowTable(paramIconElement) {
    var vRowSelected = $(paramIconElement).closest("tr");
    var vDataRow = $("#divTable #order-table").DataTable().row(vRowSelected).data();
    return vDataRow.id;
}


// hàm reset form 
function resetForm() {
    "use strict";
    gSTT = 1;
    gUserId = 0;
    gOrderId = 0;
    gFormMode = "";

    $("#inp-order-code").val("");
    $("#inp-size").val("");
    $("#inp-diameter").val("");
    $("#inp-grill").val("");
    $("#inp-count-drink").val("");
    $("#inp-salad").val("");
    $("#select-drink option").filter(function() {
        return $(this).text == "none";
    }).prop("selected", true);
    $("#inp-type-pizza").val("");
    $("#inp-voucher-code").val("");
    $("#inp-total-price").val("");
    $("#inp-discount").val("");
    $("#inp-status").val("");
    $("#inp-message").val("");

    $("#inp-name").val("");
    $("#inp-email").val("");
    $("#inp-phone").val("");
    $("#inp-address").val("");
}