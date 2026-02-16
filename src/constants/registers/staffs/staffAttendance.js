import React from "react";
import { downloadExcelFile } from "../../../utils/downloadExcelFile";

const HOLIDAYS = ["2026-01-26", "2026-05-01", "2026-08-15", "2026-12-25", "2027-01-01"];

export const getStaffAttendanceCols = () => {
  let cols = ["S.No", "Staff Name", "Designation"];
  for (let i = 1; i <= 31; i++) {
    cols.push(`${i} In`);
    cols.push(`${i} Out`);
  }
  return cols;
};
export const StaffAttendanceRegister = ({
  rows,
  setRows,
  month,
  selectedReg,
  branch
}) => {

  const isHoliday = (dayNum) => {
    if (!month) return false;
    const dateStr = `${month}-${dayNum.toString().padStart(2, "0")}`;
    const dateObj = new Date(dateStr);
    const isSunday = dateObj.getDay() === 0;
    const isGovtHoliday = HOLIDAYS.includes(dateStr);
    return isSunday || isGovtHoliday;
  };

  const handleDownload = () => {
    const dataToExport = rows.map((row, index) => {
      const obj = {
        "S.No": index + 1,
        "Staff Name": row["Staff Name"] || "-",
        "Designation": row["Designation"] || "-",
      };

      for (let i = 1; i <= 31; i++) {
        if (isHoliday(i)) {
          obj[`Day ${i} In`] = "HOLIDAY";
          obj[`Day ${i} Out`] = "HOLIDAY";
        } else {
          obj[`Day ${i} In`] = row[`${i} In`] || "-";
          obj[`Day ${i} Out`] = row[`${i} Out`] || "-";
        }
      }

      obj["Total Leaves"] = calculateLeaves(row);
      return obj;
    });

    downloadExcelFile(dataToExport, "Staff_Attendance", branch, month);
  };

  const currentCols = getStaffAttendanceCols();

  const onAddRow = () => setRows([...rows, { id: Date.now() }]);

  const onRemoveRow = (id) => {
    if (rows.length > 1) setRows(rows.filter((r) => r.id !== id));
    else alert("At least one row is required.");
  };

  const onCellChange = (id, col, val) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [col]: val } : r)));
  };

  const calculateLeaves = (row) => {
    let totalLeaves = 0;
    const [year, monthNum] = month.split("-");
    const daysInThisMonth = new Date(year, monthNum, 0).getDate();
    const dayNumbers = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

    dayNumbers.forEach((dayNum) => {
      const dayInt = parseInt(dayNum);
      if (dayInt > daysInThisMonth) return;

      if (!isHoliday(dayInt)) {
        const inVal = (row[`${dayNum} In`] || "").toUpperCase();
        const outVal = (row[`${dayNum} Out`] || "").toUpperCase();
        if (inVal === "L" && outVal === "L") totalLeaves += 1.0;
        else if (inVal === "L" || outVal === "L") totalLeaves += 0.5;
      }
    });
    return totalLeaves;
  };

  return (
    <>
      <div
        style={{
          overflowX: "auto",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          background: "#fff",
          maxHeight: "70vh",
        }}
      >
        <table
          border="1"
          style={{
            width: "max-content",
            minWidth: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            fontSize: "13px",
          }}
        >
          <thead
            style={{
              background: "#f0fdf4",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <tr>
              <th
                style={{
                  padding: "6px",
                  border: "1px solid #e2e8f0",
                  color: "#0f766e",
                  width: "40px",
                  position: "sticky",
                  left: 0,
                  background: "#f0fdf4",
                  zIndex: 11,
                }}
              >
                ×
              </th>
              {currentCols.map((col) => {
                const isSticky =
                  col === "S.No" ||
                  col === "Staff Name" ||
                  col === "Designation";
                let leftPos =
                  col === "S.No"
                    ? 40
                    : col === "Staff Name"
                      ? 80
                      : col === "Designation"
                        ? 300
                        : 0;
                return (
                  <th
                    key={col}
                    style={{
                      padding: "8px 4px",
                      border: "1px solid #e2e8f0",
                      color: "#0f766e",
                      minWidth:
                        col === "S.No"
                          ? "40px"
                          : col === "Staff Name"
                            ? "220px"
                            : col === "Designation"
                              ? "180px"
                              : "65px",
                      position: isSticky ? "sticky" : "static",
                      left: isSticky ? leftPos : "auto",
                      background: "#f0fdf4",
                      zIndex: isSticky ? 11 : 1,
                    }}
                  >
                    {col}
                  </th>
                );
              })}
              <th
                style={{
                  padding: "8px",
                  border: "1px solid #e2e8f0",
                  color: "#b91c1c",
                  background: "#fee2e2",
                  position: "sticky",
                  right: 0,
                  zIndex: 11,
                  minWidth: "80px",
                }}
              >
                Leaves
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td
                  style={{
                    textAlign: "center",
                    border: "1px solid #e2e8f0",
                    position: "sticky",
                    left: 0,
                    background: "#fff",
                    zIndex: 5,
                  }}
                >
                  <button
                    onClick={() => onRemoveRow(row.id)}
                    style={{
                      color: "#ef4444",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    ×
                  </button>
                </td>
                {currentCols.map((col) => {
                  const isSNo = col === "S.No";
                  const isSticky =
                    isSNo || col === "Staff Name" || col === "Designation";
                  const isTimeCol = col.includes("In") || col.includes("Out");

                  const dayNum = parseInt(col.split(" ")[0]);
                  const isH = isTimeCol && !isNaN(dayNum) && isHoliday(dayNum);

                  let leftPos = isSNo
                    ? 40
                    : col === "Staff Name"
                      ? 80
                      : col === "Designation"
                        ? 300
                        : 0;
                  return (
                    <td
                      key={col}
                      style={{
                        border: "1px solid #e2e8f0",
                        padding: 0,
                        position: isSticky ? "sticky" : "static",
                        left: isSticky ? leftPos : "auto",
                        background: isSticky ? "#fff" : isH ? "#fef3c7" : "transparent",
                        zIndex: isSticky ? 5 : 1,
                      }}
                    >
                      <input
                        value={isSNo ? index + 1 : isH ? "HOLIDAY" : row[col] || ""}
                        readOnly={isSNo || isH}
                        onChange={(e) => {
                          if (!isSNo && !isH) {
                            let val = e.target.value;
                            if (isTimeCol)
                              val = val.replace(/[^0-9:Ll]/g, "").toUpperCase();
                            onCellChange(row.id, col, val);
                          }
                        }}
                        placeholder={isH ? "" : isTimeCol ? "9:00 / L" : ""}
                        style={{
                          width: "100%",
                          padding: "8px 6px",
                          border: "none",
                          outline: "none",
                          textAlign: isSNo || isTimeCol ? "center" : "left",
                          backgroundColor:
                            isH ? "#fef3c7" : 
                            row[col]?.toUpperCase() === "L"
                              ? "#fee2e2"
                              : isSNo
                                ? "#f8fafc"
                                : "transparent",
                          color:
                            isH ? "#92400e" :
                            row[col]?.toUpperCase() === "L"
                              ? "#b91c1c"
                              : "#1e293b",
                          fontWeight:
                            isH || row[col]?.toUpperCase() === "L" || isSNo
                              ? "bold"
                              : "normal",
                        }}
                      />
                    </td>
                  );
                })}
                <td
                  style={{
                    textAlign: "center",
                    border: "1px solid #e2e8f0",
                    position: "sticky",
                    right: 0,
                    background: "#fff5f5",
                    fontWeight: "bold",
                    color: "#b91c1c",
                    zIndex: 5,
                    boxShadow: "-2px 0 5px rgba(0,0,0,0.05)",
                  }}
                >
                  {calculateLeaves(row)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={onAddRow}
        style={{
          marginTop: "20px",
          padding: "12px 25px",
          background: "#0f766e",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        + Add New Row
      </button>
      
      <button
        onClick={handleDownload}
        style={{
          marginTop: "20px",
          marginLeft: "10px",
          padding: "12px 25px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        📥 Download Staff Sheet
      </button>
    </>
  );
};
