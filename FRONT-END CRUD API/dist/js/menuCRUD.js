/***REGION 1: Vùng khai báo các biến, hằng số, toàn cục ***/
"use strict";
const gMENU_COMBO_COL = ["id", "size", "diameter", "grill", "salad", "countDrink", "price", "actions"];
const gMENU_COMBO_STT_COL = 0;
const gMENU_COMBO_SIZE_COL = 1;
const gMENU_COMBO_DIAMETER_COL = 2;
const gMENU_COMBO_GRILL_COL = 3;
const gMENU_COMBO_SALAD_COL = 4;
const gMENU_COMBO_COUNT_DRINK_COL = 5;
const gMENU_COMBO_PRICE_COL = 6;
const gMENU_COMBO_ACTIONS_COL = 7;

var gSTT = 1;

var gMenuId = 0;

var gFormMode = "";

var gMenuTable = $("#menu-table").DataTable({
    columns: [
        { data: gMENU_COMBO_COL[gMENU_COMBO_STT_COL] },
        { data: gMENU_COMBO_COL[gMENU_COMBO_SIZE_COL] },
        { data: gMENU_COMBO_COL[gMENU_COMBO_DIAMETER_COL] },
        { data: gMENU_COMBO_COL[gMENU_COMBO_GRILL_COL] },
        { data: gMENU_COMBO_COL[gMENU_COMBO_SALAD_COL] },
        { data: gMENU_COMBO_COL[gMENU_COMBO_COUNT_DRINK_COL] },
        { data: gMENU_COMBO_COL[gMENU_COMBO_PRICE_COL] },
        { data: gMENU_COMBO_COL[gMENU_COMBO_ACTIONS_COL] },
    ],

    columnDefs: [
        {
            targets: gMENU_COMBO_ACTIONS_COL,
            defaultContent: `
                <span ><i class="fas fa-edit fa-lg text-primary edit-menu " style="cursor: pointer" data-toggle="tooltip" title="Edit"></i></span>
                <span ><i class="far fa-trash-alt fa-lg ml-2 text-danger delete-menu" style="cursor: pointer" data-toggle="tooltip" title="Delete"></i></span>
            `
        },

        {
            targets: gMENU_COMBO_STT_COL,
            render: function() {
                return gSTT++;
            }
        }
    ]
})

/***REGION 2: Vùng thực thi các sự kiện ***/
$(document).ready(function() {
    onPageLoading();

    $("#btn-save-menu").on("click", onBtnSaveMenuClick);

    $("#menu-table").on("click", ".edit-menu", function () {
        onIconEditMenuClick(this);
    });

    $("#menu-table").on("click", ".delete-menu", function () {
        onIconDeleteMenuClick(this);
    });

    $("#btn-delete-menu").on("click", onBtnDeleteMenuClick);

    //reset dữ liệu khi click nút cancel
    $('#modalDeleteDrink').on('hidden.bs.modal', function () {
        resetForm();
    });
})



/***REGION 3: Vùng khai báo các hàm xử lý sự kiện ***/
// hàm xử lý sự kiện load trang
function onPageLoading() {
    "use strict";
    callApiGetDataMenuList();
   
}

// hàm xử lý sự kiện khi click nút save 
function onBtnSaveMenuClick() {
    "use strict";
    var vMenuObject = {
        size: "",
        diameter: "",
        grill: "",
        salad: "",
        countDrink: "",
        price: "",
    }

    //B1: thu thập dữ liệu
    getDataForm(vMenuObject);
    //B2: validate dữ liệu
    var vIsValidate = validateDataForm(vMenuObject);
    if (vIsValidate) {
        //B3: Xử lý nghiệp vụ call api tạo mới hoặc cập nhật menu
        if (gFormMode === "Insert") { // update
            callApiUpdateMenu(vMenuObject, gMenuId);
        } else { // insert
            callApiCreateMenu(vMenuObject); 
        }
    }
    resetForm();
}

// hàm xử lý sự kiện khi click icon menu
function onIconEditMenuClick(paramIconElement) {
    "use strict";
    // trạng thái nhận biết insert
    gFormMode = "Insert";
    // lấy id của row tương ứng
    gMenuId = getMenuIdToDataRowTable(paramIconElement);
    callApiGetMenuById(gMenuId);
}

// hàm xử lý sự kiện click icon delete menu
function onIconDeleteMenuClick(paramIconElement) {
    "use strict";
    // lấy id của row tương ứng
    gMenuId = getMenuIdToDataRowTable(paramIconElement);
    // hiển thị modal xác nhận
    $("#modalDeleteMenu").modal("show");
}

// hàm xử lý sự kiện click nút delete menu
function onBtnDeleteMenuClick() {
    "use strict";
    callApiDeleteMenu(gMenuId);
    // ẩn modal
    $("#modalDeleteMenu").modal("hide");

}



/***REGION 4: Vùng khai báo các hàm dùng chung trong chương trình ***/
// hàm thu thập dữ liệu trên form
function getDataForm(paramMenuObject) {
    "use strict";
    paramMenuObject.size = $("#inp-menu-size").val();
    paramMenuObject.diameter = $("#inp-diameter").val();
    paramMenuObject.grill = $("#inp-grill").val();
    paramMenuObject.salad = $("#inp-salad").val();
    paramMenuObject.countDrink = $("#inp-count-drink").val();
    paramMenuObject.price = $("#inp-price").val();
}

// hàm validate dữ liệu
function validateDataForm(paramMenuObject) {
    "use strict";
    if (paramMenuObject.size === "") {
        alert("Xin nhập size combo!");
        return false;
    }
    if (paramMenuObject.diameter === "") {
        alert("Xin nhập đường kính!");
        return false;
    }
    if (paramMenuObject.grill === "") {
        alert("Xin nhập số sườn nướng!");
        return false;
    }
    if (paramMenuObject.salad === "") {
        alert("Xin nhập salad!");
        return false;
    }
    if (paramMenuObject.countDrink === "") {
        alert("Xin nhập số nước ngọt!");
        return false;
    }
    if (paramMenuObject.price === "") {
        alert("Xin nhập đơn giá!");
        return false;
    }

    return true;
}

// hàm call api lấy danh sách menu
function callApiGetDataMenuList() {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/menu/all",
        type: "GET",
        dataType: "json",
        success: function (res) {
            // console.log(res);
            loadDataMenuListToTable(res);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call Api lấy menu theo id
function callApiGetMenuById(paramMenuId) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/menu/detail/" + paramMenuId,
        type: "GET",
        dataType: "json",
        success: function (res) {
            // console.log(res);
            loadDataMenuToForm(res);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call Api create menu
function callApiCreateMenu(paramMenuObject) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/menu/create",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(paramMenuObject),
        success: function (res) {
            // console.log(res);
            callApiGetDataMenuList();
           
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call api update menu
function callApiUpdateMenu(paramMenuObject, paramMenuId) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/menu/update/" + paramMenuId,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(paramMenuObject),
        success: function (res) {
            // console.log(res);
            callApiGetDataMenuList();

        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call Api delete menu
function callApiDeleteMenu(paramMenuId) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/menu/delete/" + paramMenuId,
        type: "DELETE",
        success: function () {
            alert("Delete menu combo thành công!");
            resetForm();
            callApiGetDataMenuList();
           
        },
        error: function (err) {
            console.log(err);
        }
    });
}

//hàm hiển thị danh sách menu lên table
function loadDataMenuListToTable(paramResponseMenu) {
    "use strict";
    gMenuTable.clear();
    gMenuTable.rows.add(paramResponseMenu);
    gMenuTable.draw();
}

// hàm hiển thị thông tin menu cần edit lên form 
function loadDataMenuToForm(paramMenuObj) {
    "use strict";
    $("#inp-menu-size").val(paramMenuObj.size);
    $("#inp-diameter").val(paramMenuObj.diameter);
    $("#inp-grill").val(paramMenuObj.grill);
    $("#inp-salad").val(paramMenuObj.salad);
    $("#inp-count-drink").val(paramMenuObj.countDrink);
    $("#inp-price").val(paramMenuObj.price);
}

// hàm lấy menu id từ row tương ứng trong table
function getMenuIdToDataRowTable(paramIconElement) {
    "use strict";
    var vRowSelected = $(paramIconElement).closest("tr");
    var vDataRow = gMenuTable.row(vRowSelected).data();
    return vDataRow.id;
}


// hàm reset form 
function resetForm() {
    "use strict";
    gSTT = 1;
    gMenuId = 0;

    $("#inp-menu-size").val("");
    $("#inp-diameter").val("");
    $("#inp-grill").val("");
    $("#inp-salad").val("");
    $("#inp-count-drink").val("");
    $("#inp-price").val("");
}