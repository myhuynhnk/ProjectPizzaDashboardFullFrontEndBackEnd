/***REGION 1: Vùng khai báo các biến, hằng số, toàn cục ***/
"use strict";
const gCOUNTRY_COL = ["id", "countryCode", "countryName", "actions"];
const gCOUNTRY_STT_COL = 0;
const gCOUNTRY_CODE_COL = 1;
const gCOUNTRY_NAME_COL = 2;
const gCOUNTRY_ACTIONS_COL = 3;

const gREGION_COL = ["id", "regionCode", "regionName", "actions"];
const gREGION_STT_COL = 0;
const gREGION_CODE_COL = 1;
const gREGION_NAME_COL = 2;
const gREGION_ACTIONS_COL = 3;

var gSTT = 1;

var gCountryId = 0;

var gRegionId = 0;

var gFormMode = "";


/***REGION 2: Vùng thực thi các sự kiện ***/
$(document).ready(function () {
    onPageLoading();

    $("#btn-save-country").on("click", onBtnSaveCountryClick);

    $("body").delegate(".edit-country", "click", function () {
        onIconEditCountryClick(this);
    });

    $("body").delegate(".delete-country", "click", function () {
        onIconDeleteCountryClick(this);
    });

    $("body").delegate(".add-region", "click", function () {
        onIconAddRegionClick(this);
    });

    $("#btn-delete-country").on("click", onBtnDeleteCountryClick);

    //reset dữ liệu khi click nút cancel
    $('#modalDeleteCountry').on('hidden.bs.modal', function () {
        resetForm();
    });

    // sự kiện click nút save region
    $("#btn-save-region").on("click", onBtnSaveRegionClick);

    $("body").delegate(".edit-region", "click", function() {
        onIconEditRegionClick(this);
    });

    $("body").delegate(".delete-region", "click", function() {
        onIconDeleteRegionClick(this);
    });


    // sự kiện click hiển thị danh sách country
    $("#btn-show-country").on("click", onBtnShowListCountryClick);

    // sự kiện click hiển thị danh sách region
    $("#btn-show-region").on("click", onBtnShowListRegionClick);

    $("#btn-delete-region").on("click", onBtnDeleteRegionClick)

})



/***REGION 3: Vùng khai báo các hàm xử lý sự kiện ***/
// hàm xử lý sự kiện load trang
function onPageLoading() {
    "use strict";
    createAndGetDataCountryToTable()


}

// hàm xử lý sự kiện click nút show list country
function onBtnShowListCountryClick() {
    "use strict";
    resetForm();
    createAndGetDataCountryToTable();
}


// hàm xử lý sự kiện khi click nút save 
function onBtnSaveCountryClick() {
    "use strict";
    var vCountryObject = {
        countryCode: "",
        countryName: "",
    }

    //B1: thu thập dữ liệu
    getDataForm(vCountryObject);
    //B2: validate dữ liệu
    var vIsValidate = validateDataForm(vCountryObject);
    if (vIsValidate) {
        //B3: Xử lý nghiệp vụ call api tạo mới hoặc cập nhật menu
        if (gFormMode === "Insert") { // update
            callApiUpdateCountry(vCountryObject, gCountryId);
        } else { // insert
            callApiCreateCountry(vCountryObject);
        }
    }
    resetForm();
}

// hàm xử lý sự kiện khi click icon country
function onIconEditCountryClick(paramIconElement) {
    "use strict";
    // trạng thái nhận biết insert
    gFormMode = "Insert";
    // lấy id của row tương ứng
    gCountryId = getCountryIdToDataRowTable(paramIconElement);
    callApiGetCountryById(gCountryId);
}

// hàm xử lý sự kiện click icon delete country
function onIconDeleteCountryClick(paramIconElement) {
    "use strict";
    // lấy id của row tương ứng
    gCountryId = getCountryIdToDataRowTable(paramIconElement);
    // hiển thị modal xác nhận
    $("#modalDeleteCountry").modal("show");
}

// hàm xử lý sự kiện click nút delete menu
function onBtnDeleteCountryClick() {
    "use strict";
    callApiDeleteCountry(gCountryId);
    // ẩn modal
    $("#modalDeleteCountry").modal("hide");

}

/**
 * Các hàm sự kiện với region
*/
// hàm xử lý sự kiện click nút show list region hiển thị danh sách
function onBtnShowListRegionClick() {
    "use strict";
    resetForm();
    createTableAndLoadDataRegionToTable();
}

// hàm xử lý sự kiện click icon edit region
function onIconEditRegionClick(paramIconElement) {
    "use strict";
    gFormMode = "Insert";
    gRegionId = getRegionIdToRowTable(paramIconElement);
    // disabled select country 
    
    callApiGetRegionById(gRegionId);

    $("#select-country").prop("disabled", true);

    // hiển thị modal form
    $("#modalFormRegion").modal("show");
}

// hàm xử lý sự kiện click icon delete region
function onIconDeleteRegionClick(paramIconElement) {
    "use strict";
    gRegionId = getRegionIdToRowTable(paramIconElement);

    $("#modalDeleteRegion").modal("show");
}

// hàm xử lý sự kiện click nút thêm region
function onIconAddRegionClick(paramIconElement) {
    "use strict";
    $("#modalFormRegion").modal("show");
    // loadDataCountryToSelectOption();
    // lấy id của row tương ứng
    gCountryId = getCountryIdToDataRowTable(paramIconElement);
    // console.log(gCountryId);
    $("#select-country").prop("disabled", false);
    
}

// hàm xử lý sự kiện click nút save region
function onBtnSaveRegionClick() {
    "use strict";
    var vRegionObject = {
        regionCode: "",
        regionName: "",
        countryId: "",
        countryName: "",
    }

    //B1: thu thập dữ liệu
    getDataFormRegion(vRegionObject);
    //B2: validate dữ liệu
    var vIsValidate = validateData(vRegionObject)
    if (vIsValidate) {
        //B3: Xử lý nghiệp vụ call api tạo mới hoặc cập nhật region
        if (gFormMode === "Insert") { // update
            callApiUpdateRegion(vRegionObject, gRegionId);
        } else { // insert
            callApiCreateRegion(vRegionObject);
        }
    }
    resetForm();
}

// hàm xử lý sự kiện click nút delete region
function onBtnDeleteRegionClick() {
    "use strict";
    callApiDeleteRegion(gRegionId);
}


/***REGION 4: Vùng khai báo các hàm dùng chung trong chương trình ***/
function createAndGetDataCountryToTable() {
    "use strict";
    $("#divTable").html("");
    $("#divTable").append(`
        <h4 class="my-3">Danh sách quốc gia </h4>
        <table id="country-table" class="table table-bordered table-striped table-hover">
            <thead>
                <th>STT</th>
                <th>Mã quốc gia</th>
                <th>Tên quốc gia</th>
                <th>Actions</th>
            </thead>
            <tbody></tbody> 
        </table> 
    `);

    var vTable = $("#divTable table").DataTable({
        columns: [
            { data: gCOUNTRY_COL[gCOUNTRY_STT_COL] },
            { data: gCOUNTRY_COL[gCOUNTRY_CODE_COL] },
            { data: gCOUNTRY_COL[gCOUNTRY_NAME_COL] },
            { data: gCOUNTRY_COL[gCOUNTRY_ACTIONS_COL] },
        ],

        columnDefs: [
            {
                targets: gCOUNTRY_ACTIONS_COL,
                defaultContent: `
                <span ><i class="fas fa-plus fa-lg text-info add-region " style="cursor: pointer" data-toggle="tooltip" title="Add region"></i></span>
                <span ><i class="fas fa-edit fa-lg ml-2 text-primary edit-country " style="cursor: pointer" data-toggle="tooltip" title="Edit"></i></span>
                <span ><i class="far fa-trash-alt fa-lg ml-2 text-danger delete-country" style="cursor: pointer" data-toggle="tooltip" title="Delete"></i></span>
            `
            },

            {
                targets: gCOUNTRY_STT_COL,
                render: function () {
                    return gSTT++;
                }
            }
        ]
    })

    callApiGetDataCountryList(vTable);
}


function createTableAndLoadDataRegionToTable() {
    "use strict";
    $("#divTable").html("");
    $("#divTable").append(`
        <h4 class="my-3">Danh sách vùng </h4>
        <table id="region-table" class="table table-bordered table-striped table-hover">
            <thead>
                <th>STT</th>
                <th>Mã vùng</th>
                <th>Tên vùng</th>
                <th>Actions</th>
            </thead>
            <tbody></tbody> 
        </table> 
    `);

    var vTable = $("#divTable table").DataTable({
        columns: [
            { data: gREGION_COL[gREGION_STT_COL] },
            { data: gREGION_COL[gREGION_CODE_COL] },
            { data: gREGION_COL[gREGION_NAME_COL] },
            { data: gREGION_COL[gREGION_ACTIONS_COL] },
        ],
    
        columnDefs: [
            {
                targets: gREGION_ACTIONS_COL,
                defaultContent: `
                    <span ><i class="fas fa-edit fa-lg text-primary edit-region " style="cursor: pointer" data-toggle="tooltip" title="Edit"></i></span>
                    <span ><i class="far fa-trash-alt fa-lg ml-2 text-danger delete-region" style="cursor: pointer" data-toggle="tooltip" title="Delete"></i></span>
                `
            },
    
            {
                targets: gREGION_STT_COL,
                render: function() {
                    return gSTT++;
                }
            },  
        ]
    });

    callApiGetDataRegionList(vTable);

}

// hàm thu thập dữ liệu trên form Country
function getDataForm(paramCountryObject) {
    "use strict";
    paramCountryObject.countryCode = $("#inp-country-code").val();
    paramCountryObject.countryName = $("#inp-country-name").val();
}

// hàm thu thập dữ liệu form region
function getDataFormRegion(paramRegionObject) {
    "use strict";
    paramRegionObject.regionCode = $("#inp-region-code").val();
    paramRegionObject.regionName = $("#inp-region-name").val();
    paramRegionObject.countryId = gCountryId;
    paramRegionObject.countryName = $("#select-country option:selected").text();
}


// hàm validate dữ liệu
function validateDataForm(paramCountryObject) {
    "use strict";
    if (paramCountryObject.countryCode === "") {
        alert("Xin nhập mã quốc gia!");
        return false;
    }
    if (paramCountryObject.countryName === "") {
        alert("Xin nhập tên quốc gia!");
        return false;
    }

    return true;
}

// hàm validate dữ liệu form region
function validateData(paramRegionObject) {
    "use strict";
    if (paramRegionObject.regionCode === "") {
        alert("Xin nhập mã vùng!");
        return false;
    }
    if (paramRegionObject.regionName === "") {
        alert("Xin nhập tên vùng!");
        return false;
    }
    return true;
}



// hàm call api lấy danh sách country
function callApiGetDataCountryList(paramTable) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/country/all",
        type: "GET",
        dataType: "json",
        success: function (res) {
            paramTable.clear();
            paramTable.rows.add(res);
            paramTable.draw();
            loadDataCountryToSelectOption(res);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call Api lấy country theo id
function callApiGetCountryById(paramCountryId) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/country/detail/" + paramCountryId,
        type: "GET",
        dataType: "json",
        success: function (res) {
            loadDataCountryToForm(res);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call Api create country
function callApiCreateCountry(paramCountryObject) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/country/create",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(paramCountryObject),
        success: function (res) {
            createAndGetDataCountryToTable();

        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call api update country
function callApiUpdateCountry(paramCountryObject, paramCountryId) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/country/update/" + paramCountryId,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(paramCountryObject),
        success: function (res) {
            // console.log(res);
            createAndGetDataCountryToTable();

        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call Api delete country
function callApiDeleteCountry(paramCountryId) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/country/delete/" + paramCountryId,
        type: "DELETE",
        success: function () {
            alert("Delete country thành công!");
            resetForm();
            createAndGetDataCountryToTable();

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

// hàm call api lấy danh sách region
function callApiGetDataRegionList(paramTable) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/region/all",
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

// hàm call Api lấy region theo id
function callApiGetRegionById(paramRegionId) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/region/detail/" + paramRegionId,
        type: "GET",
        dataType: "json",
        success: function (res) {
           loadDataRegionToForm(res);
        },
        error: function (err) {
            console.log(err);
        }
    });
}


// hàm call api create region
function callApiCreateRegion(paramRegionObj) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/region/create/" + paramRegionObj.countryId,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(paramRegionObj),
        success: function (res) {
            // console.log(res);  
            $("#modalFormRegion").modal("hide");
            createTableAndLoadDataRegionToTable();
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call Api update Region
function callApiUpdateRegion(paramRegionObject, paramRegionId) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/region/update/" + paramRegionId,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(paramRegionObj),
        success: function (res) {
            // console.log(res);  
            $("#modalFormRegion").modal("hide");
            createTableAndLoadDataRegionToTable();
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm call Api delete region
function callApiDeleteRegion(paramRegionId) {
    "use strict";
    $.ajax({
        url: "http://localhost:8080/region/delete/" + paramRegionId,
        type: "DELETE",
        success: function (res) { 
            $("#modalDeleteRegion").modal("hide");
            alert("Delete region thành công!");
            resetForm();
            createTableAndLoadDataRegionToTable();
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// hàm hiển thị thông tin country cần edit lên form 
function loadDataCountryToForm(paramCountryObj) {
    "use strict";
    $("#inp-country-code").val(paramCountryObj.countryCode);
    $("#inp-country-name").val(paramCountryObj.countryName);
}

// hàm hiển thị dữ liệu region trả về lên form
function loadDataRegionToForm(paramRegionObject) {
    "use strict";
    $("#inp-region-code").val(paramRegionObject.regionCode);
    $("#inp-region-name").val(paramRegionObject.regionName);
    $("#select-country option").filter(function() {
        return $(this).text() == paramRegionObject.countryName;
    }).prop("selected", true);
}

// hàm hiển thị danh sách country lên select/option
function loadDataCountryToSelectOption(paramCountryObj) {
    "use strict";
    $("#select-country").find("option:gt(0)").remove();
    paramCountryObj.map((bCountry) => {
        $("#select-country").append(`
            <option value=${bCountry.countryCode}>${bCountry.countryName}</option>
        `)
    })
}


// hàm lấy menu id từ row tương ứng trong table
function getCountryIdToDataRowTable(paramIconElement) {
    "use strict";
    var vRowSelected = $(paramIconElement).closest("tr");
    var vDataRow = $("#divTable table").DataTable().row(vRowSelected).data();
    return vDataRow.id;
}

function getRegionIdToRowTable(paramIconElement) {
    var vRowSelected = $(paramIconElement).closest("tr");
    var vDataRow = $("#divTable #region-table").DataTable().row(vRowSelected).data();
    return vDataRow.id;
}


// hàm reset form 
function resetForm() {
    "use strict";
    gSTT = 1;
    gCountryId = 0;
    gRegionId = 0;
    gFormMode = "";

    $("#inp-country-code").val("");
    $("#inp-country-name").val("");

    $("#inp-region-code").val("");
    $("#inp-region-name").val("");
    $("#select-country option").filter(function() {
        return $(this).val() == "none";
    }).prop("selected", true);
}