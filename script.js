// Add an initial order row when the page loads
window.onload = function() {
  addOrder();
};

function addOrder() {
  const tbody = document.querySelector("#orderTable tbody");
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" placeholder="Code" style="text-align: left; direction: ltr;" /></td>
    <td><input type="text" placeholder="Description" /></td>
    <td><input type="number" placeholder="Qty" min="1" oninput="updateTotal(this)" /></td>
    <td><input type="number" placeholder="Price" min="0" step="0.01" oninput="updateTotal(this)" /></td>
    <td class="total">0.00</td>
    <td><button onclick="removeRow(this)" style="background: #dc3545; color: white; border: none; border-radius: 3px; padding: 5px 10px;">حذف</button></td>
  `;
  tbody.appendChild(row);
}

function removeRow(button) {
  const row = button.closest('tr');
  row.remove();
  updateGrandTotal();
}

function updateTotal(input) {
  const row = input.parentElement.parentElement;
  const qty = parseFloat(row.children[2].children[0].value) || 0;
  const price = parseFloat(row.children[3].children[0].value) || 0;
  const total = qty * price;
  row.children[4].textContent = total.toFixed(2);
  updateGrandTotal();
}

function updateGrandTotal() {
  const totals = [...document.querySelectorAll(".total")];
  let grandTotal = 0;
  totals.forEach(total => {
    grandTotal += parseFloat(total.textContent) || 0;
  });
  document.getElementById("grandTotal").textContent = grandTotal.toFixed(2);
}

function validateForm() {
  let isValid = true;
  
  // Reset error messages
  document.querySelectorAll('.error').forEach(error => {
    error.style.display = 'none';
  });
  
  // Validate customer name
  const customerName = document.getElementById("customerName").value.trim();
  if (!customerName) {
    document.getElementById("customerNameError").style.display = 'block';
    isValid = false;
  }
  
  // Validate phone number
  const customerPhone = document.getElementById("customerPhone").value.trim();
  if (!customerPhone) {
    document.getElementById("customerPhoneError").style.display = 'block';
    isValid = false;
  }
  
  // Validate user name
  const userName = document.getElementById("userName").value.trim();
  if (!userName) {
    document.getElementById("userNameError").style.display = 'block';
    isValid = false;
  }
  
  // Check if there are any order items
  const rows = [...document.querySelectorAll("#orderTable tbody tr")];
  if (rows.length === 0) {
    alert("Please add at least one order item.");
    isValid = false;
  }
  
  return isValid;
}

function printWaybill() {
  if (!validateForm()) {
    return;
  }

  const name = document.getElementById("customerName").value;
  const phone = document.getElementById("customerPhone").value;
  const user = document.getElementById("userName").value;

  const rows = [...document.querySelectorAll("#orderTable tbody tr")];
  let orderRows = "";
  let grandTotal = 0;

  rows.forEach(r => {
    const code = r.children[0].children[0].value || "";
    const desc = r.children[1].children[0].value || "";
    const qty = r.children[2].children[0].value || "0";
    const price = r.children[3].children[0].value || "0";
    const total = r.children[4].textContent || "0.00";
    grandTotal += parseFloat(total) || 0;

    orderRows += `
      <tr>
        <td style="text-align: left; direction: ltr;">${code}</td>
        <td>${desc}</td>
        <td>${qty}</td>
        <td>${price}</td>
        <td>${total}</td>
      </tr>`;
  });

  const orderNumber = 'ORD-' + Date.now();
  const currentDate = new Date().toLocaleDateString();

  const html = `
    <html dir="rtl">
    <head>
      <title>Waybill ${orderNumber}</title>
      <style>
        @page {
          size: A4; /* حجم صفحة الطباعة */
          margin: 10mm; /* هوامش صغيرة */
        }

        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background: url('./Background.jpg') no-repeat center center fixed;
          background-size: cover; /* تجعل الخلفية تغطي الصفحة */
          -webkit-print-color-adjust: exact !important; /* لعرض الخلفية في الطباعة */
        }

        /* لتفادي انقسام الصفحة */
        .invoice-content {
          background-color: rgba(255, 255, 255, 0.9);
          padding: 20px 25px;
          border-radius: 10px;
          page-break-inside: avoid; /* يمنع انقسام المحتوى */
        }

        .header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          border-bottom: 1px solid #ccc; 
          padding-bottom: 10px; 
        }

        .logo { height: 60px; width: auto; }
        .company-info { flex-grow: 1; text-align: center; }
        .company-info h2 { margin: 0; color: #333; }

        .info-section { margin: 15px 0; }
        .info-section p { margin: 5px 0; text-align: right; }

        table { width: 100%; border-collapse: collapse; margin-top: 15px; direction: rtl; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: right; font-size: 14px; }
        th { background-color: #f8f9fa; }
        .grand-total { font-weight: bold; background-color: #f8f9fa; }

        .notes-box {
          border: 1px solid #ccc;
          background-color: #f9f9f9;
          padding: 10px 15px;
          margin-top: 20px;
          border-radius: 6px;
        }
        .notes-box h3 { margin-top: 0; text-align: right; }
        .notes-box ul { list-style-type: disc; padding-right: 20px; line-height: 1.7; text-align: right; }

        .footer {
          margin-top: 25px;
          text-align: center;
          font-style: italic;
          color: #555;
        }

        @media print {
          button { display: none; }
          html, body {
            background: url('./Background.jpg') no-repeat center center fixed !important;
            background-size: cover !important;
            -webkit-print-color-adjust: exact !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-content">
        <div class="header">
          <div class="company-info">
            <h2>الشركة الهندسية أحمد السيد</h2>
          </div>
          <div class="logo-container">
            <img src="./Background.jpg" alt="Company Logo" class="logo" />
          </div>
        </div>

        <div class="info-section">
          <p><strong>التاريخ:</strong> ${currentDate}</p>
          <p><strong>العميل:</strong> ${name}</p>
          <p><strong>رقم العميل:</strong> ${phone}</p>
          <p><strong>المستخدم:</strong> ${user}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>الكود</th>
              <th>الصنف</th>
              <th>العدد</th>
              <th>السعر</th>
              <th>إجمالي السعر</th>
            </tr>
          </thead>
          <tbody>${orderRows}</tbody>
          <tfoot>
            <tr class="grand-total">
              <td colspan="4" style="text-align: right;">الإجمالي الكلي:</td>
              <td>${grandTotal.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <div class="notes-box">
          <h3>ملاحظات:</h3>
          <ul>
            <li>القيمة الحسابية وأعمال المكتب الفني مجاناً ضمن هذا السعر إن طلبت من العميل.</li>
            <li>الوزن المنفذ تقريبي ويعتمد التوريد الفعلي لبنود الموقع.</li>
            <li>الأسعار تشمل التوريد والتركيب على أن الورشة الخاصة جاهزة للعمل.</li>
            <li>الأسعار لا تشمل ضريبة القيمة المضافة والاشتراكات الاجتماعية.</li>
            <li>الأسعار لا تشمل توريد مفاتيح نهائية، العميل يقوم بالدفع نقداً أو شيك.</li>
            <li>الأسعار صالحة لمدة 40 يوم.</li>
            <li>فترات الدفع 80% توريد + 20% تركيب.</li>
            <li>الأسعار لا تشمل المشايات أو اختبارات التشغيل.</li>
          </ul>
        </div>

        <div class="footer">
          <p>Thank you for shipping with us!</p>
        </div>
      </div>

      <script>
        window.onload=function(){
          window.print();
          setTimeout(function(){
            window.close();
            if(window.opener) {
              const msg = window.opener.document.getElementById('printSuccess');
              if (msg) {
                msg.style.display = 'block';
                setTimeout(()=>msg.style.display='none',3000);
              }
            }
          }, 500);
        }
      </script>
    </body>
    </html>
  `;

  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
}


