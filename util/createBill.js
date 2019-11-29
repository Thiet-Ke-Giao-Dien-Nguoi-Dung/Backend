const moment = require("moment");

function createBill(data) {
    let list_li = "";
    for (let i = 0; i < data.items.length; i++) {
        let one_row = `<tr>
                    <td class="stt">${i + 1}</td>
                    <td class="name">${data.items[i].name}</td>
                    <td class="sl">${data.items[i].quantity}</td>
                    <td class="gia">${data.items[i].price}</td>
                    <td class="tt">${data.items[i].quantity * data.items[i].price}</td>
                </tr>`;
        list_li = list_li + one_row
    }
    return (`
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Title</title>
            <style>
                body{
                    font-family: arial, sans-serif;
                    background-color: #f2f2f2;
                    justify-content: center;
                    display: flex;
                }
                .bill{
                    width: 500px;
                    margin: 50px 50px;
                    background-color: #fff;
                    padding: 20px 30px;
                }
                .title{
                    text-align: center;
                }
                .title label{
                    font-weight: bold;
                }
                .tbl-title
                {
                    width: 400px;
        
                }
                .brand{
                    font-weight: bold;
                }
                .tbl-detail{
                    width: 500px;
                    border-collapse: collapse;
                    border: 1px solid #6a6a6a;
                }
                .tbl-detail td{
                    border: 1px solid #6a6a6a;
                }
                .tbl-detail th{
                    border: 1px solid #6a6a6a;
                }
                .sl, .gia, .tt{
                    text-align: right;
                }
                .stt{
                    text-align: center;
                }
                .tong-tien{
                    width: 500px;
                    font-size: 16px;
                    font-weight: bold;
                    display: -webkit-flex;
                    display: flex;
                    -webkit-align-items: flex-start;
                    align-items: flex-start;
                    -webkit-justify-content: space-between;
                    justify-content: space-between;
                    border-bottom: 1px solid #bfbfbf;
                    margin: 10px 0 20px;
                    padding: 5px 0 ;
                }
                .container-title{
                    margin: 10px 0;
                }
                .container-detail{
                    margin: 10px 0;
                }
                .footer{
                    text-align: center;
                }
            </style>
        </head>
        
        <body>
        <div class="bill">
            <div class="title">
                <label>Quán xôi Việt </label>
                <br>
                <div>144 Xuân Thủy </div>
        
                <h2>Hóa đơn thanh toán </h2>
        
            </div>
            <div class="container-title">
                <table class="tbl-title">
                    <tr>
                        <td class="brand">Ngày: </td>
                        <td>${moment(Date.now()).format("DD/MM/YYYY")} </td>
                    </tr>
                    <tr>
                        <td class="brand">Bàn số :</td>
                        <td>${data.location}</td>
                    </tr>
                </table>
            </div>
            <div class="container-detail">
                <table class="tbl-detail">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên món ăn</th>
                            <th>SL</th>
                            <th>Đơn giá </th>
                            <th>Thành tiền </th>
                        </tr>
                    </thead>
                    <tbody>
                        ${list_li}
                    </tbody>
                </table>
                <div class="tong-tien">
                    <span>Tổng thanh toán</span>
                    <span>${data.revenue}</span>
                </div>
            </div>
            <div class="footer">
                <div>Xin cám ơn quý khách</div>
                <div>Hẹn gặp lại!</div>
            </div>
            <div class="">
               <button class="" onclick=window.print()>In hoá đơn</button>
            </div>
        </div>
        
        </body>
    </html>
`);
}

module.exports = createBill;