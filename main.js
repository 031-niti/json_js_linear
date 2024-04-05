let data;
// ฟังก์ชัน window.onload เป็นการดึงข้อมูลจากไฟล์ JSON โดยใช้ fetch
window.onload = function () {
    fetch("http://127.0.0.1:5500/student_attendance.json")
        // แปลง JSON response เป็น object ใน JavaScript และเก็บใน data
        .then((response) => response.json())
        .then((responseData) => {
            data = responseData;
            // เรียกใช้ loadAttendanceData เพื่อแสดงข้อมูลในตารางการเข้าเรียน
            loadAttendanceData();
        })
        .catch((error) => console.error("Error loading the data:", error));
};

// ฟังก์ชัน loadAttendanceData เป็นการแสดงข้อมูลการเข้าเรียน
function loadAttendanceData() {
    // โดยจะดึง element ที่มี id "attendance-list"
    const listContainer = document.getElementById("attendance-list");
    // ทำการสร้าง element table ใหม่ (<table>)
    const table = document.createElement("table");
    // และสร้าง header row (<tr>) และเพิ่ม header ของตาราง (<th>) สำหรับ key แต่ละตัวใน object นักเรียนตัวแรก (data[0])
    const headerRow = table.insertRow();
    Object.keys(data[0]).forEach((key) => {
        const th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    });

    // ทำการวนลูปผ่าน object นักเรียน (data) แต่ละตัว
    data.forEach((student) => {
        // โดยสร้าง table row ใหม่
        const row = table.insertRow();
        // และวนลูปอีกครั้งผ่าน value แต่ละตัวใน object นักเรียน
        Object.values(student).forEach((value, index) => {
            const cell = row.insertCell();
            // ถ้า index ว่าอยู่ระหว่าง 2 ถึง 5 (inclusive) หรือไม่
            if (index >= 2 && index <= 5) {
                const radioInput = document.createElement("input");
                radioInput.type = "radio";
                radioInput.name = `attendance-${student["รหัสประจำตัว"]}-${index - 1
                    }`;
                radioInput.value = "เข้าเรียน";
                cell.appendChild(radioInput);

                const label = document.createElement("label");
                label.textContent = "เข้าเรียน";
                cell.appendChild(label);

                const radioInput2 = document.createElement("input");
                radioInput2.type = "radio";
                radioInput2.name = `attendance-${student["รหัสประจำตัว"]}-${index - 1
                    }`;
                radioInput2.value = "ไม่เข้าเรียน";
                cell.appendChild(radioInput2);

                const label2 = document.createElement("label");
                label2.textContent = "ไม่เข้าเรียน";
                cell.appendChild(label2);
            } else {
                cell.textContent = value;
            }
        });
    });

    listContainer.appendChild(table);
}

// ฟังก์ชัน submitAttendance เป็นการบันทึกข้อมูลการเข้าเรียน
function submitAttendance() {
    // โดยจะดึง element ของ table
    const table = document.querySelector("table");
    const rows = table.querySelectorAll("tr");
    // ทำการวนลูปผ่าน table row ทั้งหมด ยกเว้น header (เริ่มจาก index 1)
    for (let i = 1; i < rows.length; i++) {
        // วนลูปผ่าน cell จาก index 2 ถึง 5 (inclusive)
        const cells = rows[i].querySelectorAll("td");
        for (let j = 2; j <= 5; j++) {
            // ใช้ selector เพื่อหา radio button ที่ถูกเลือกใน cell ปัจจุบัน
            const radioValue = document.querySelector(
                `input[name="attendance-${rows[i].cells[0].textContent}-${j - 1
                }"]:checked`
            );
            // ถ้า radio button ถูกเลือก จะอัพเดทข้อมูลการเข้าเรียน
            if (radioValue) {
                data[i - 1][`สัปดาห์${j}`] = radioValue.value;
            }
        }
    }

    console.log("Updated attendance data:", data);
}

// ฟังก์ชัน exportData เป็นการส่งออกข้อมูล
function exportData() {
    // โดยดึง element ของ table 
    const table = document.querySelector("table");
    const rows = table.querySelectorAll("tr");
    const exportData = [];

    // ทำการวนลูปผ่าน table row ทั้งหมด
    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll("td"); ฃ
        // สร้าง object เปล่า rowData เพื่อเก็บข้อมูลนักเรียนสำหรับ row นี้
        const rowData = {};

        // วนลูปผ่าน cell ทั้งหมดใน row
        cells.forEach((cell, cellIndex) => {
            // ดึง header cell ที่ตรงกับ cell ปัจจุบัน
            const headerCell = table.rows[0].cells[cellIndex];
            const headerText = headerCell.textContent.trim();

            if (cellIndex >= 2 && cellIndex <= 5) {
                const radioInput = cell.querySelector(
                    "input[type='radio']:checked"
                );
                rowData[`สัปดาห์${cellIndex - 1}`] = radioInput
                    ? radioInput.value
                    : "";
            } else {
                rowData[headerText] = cell.textContent.trim();
            }
        });

        // ถ้า row ไม่ใช่ header row เพิ่ม rowData object ลงใน array exportData
        if (rowIndex !== 0) {
            exportData.push(rowData);
        }
    });
    // ทำการแปลง exportData array เป็น JSON string และตั้งค่า indentation เพื่ออ่านง่าย
    const jsonData = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "attendance_data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}